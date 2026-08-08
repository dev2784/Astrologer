import { FastifyInstance } from "fastify";
import { prisma } from "../../db";
import * as XLSX from "xlsx";

export async function panchangRoutes(server: FastifyInstance) {
  
  // 1. GET: Fetch Panchang List or Single Date
  server.get("/", async (request, reply) => {
    const { date } = request.query as { date?: string };
    try {
      if (date) {
        const panchang = await prisma.panchang.findUnique({ where: { date: new Date(date) } });
        if (!panchang) return reply.code(404).send({ error: "No Panchang data found for this date." });
        return reply.send({ data: panchang.data });
      }
      const list = await prisma.panchang.findMany({ orderBy: { date: "desc" } });
      return reply.send({ list });
    } catch (error) {
      return reply.code(500).send({ error: "Database error" });
    }
  });

  // 2. POST: Bulk Upload Excel
 server.post("/bulk-upload", async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) return reply.code(400).send({ error: "No Excel file found in request." });

      const buffer = await data.toBuffer();
      const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true }); 
      const sheetName = workbook.SheetNames[0];
      const rows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (!rows || rows.length === 0) return reply.code(400).send({ error: "Excel file is empty." });

      let successCount = 0;

      // FIX 1: Safely parse Date
      const parseSafeDate = (rawDate: any) => {
        if (!rawDate) return null;
        if (typeof rawDate === "number") {
          return new Date(Math.round((rawDate - 25569) * 86400 * 1000));
        }
        const parsed = new Date(rawDate);
        return isNaN(parsed.getTime()) ? null : parsed;
      };

      // FIX 2: Safely extract JUST the time (HH:MM:SS) from Excel's weird 1899 dates
      const extractTime = (val: any): string => {
        if (!val) return "";
        // If it parsed as a Date (e.g. 1899-12-30T12:13:00.000Z)
        if (val instanceof Date) {
          return val.toISOString().substr(11, 8); // Strips out everything except HH:MM:SS
        }
        // If it's a string that got ISO formatted
        if (typeof val === "string" && val.includes("1899-12-30T")) {
          return new Date(val).toISOString().substr(11, 8);
        }
        // If it's a raw Excel time decimal (e.g., 0.5 = 12:00:00)
        if (typeof val === "number" && val < 1) {
          const totalSeconds = Math.round(val * 86400);
          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        return String(val); // Fallback if it's already a clean string
      };

      const parseTime = (timeStr: any) => {
        const cleanStr = extractTime(timeStr);
        if (!cleanStr) return { hour: 0, minute: 0, second: 0 };
        const parts = String(cleanStr).split(":");
        return { hour: parseInt(parts[0] || "0"), minute: parseInt(parts[1] || "0"), second: parseInt(parts[2] || "0") };
      };

            // Auto-detect type if client omits explicit 'Shubh' or 'Ashubh' tag
      const getChoghadiyaType = (name: string, explicitType?: string): string => {
        if (explicitType) {
          const clean = explicitType.trim().toLowerCase();
          if (clean.includes("ashubh")) return "ashubh";
          if (clean.includes("shubh")) return "shubh";
        }

        // Fallback to traditional Vedic rules based on Choghadiya name
        const n = name.trim().toLowerCase();
        if (n.includes("शुभ") || n.includes("shubh") || 
            n.includes("अमृत") || n.includes("amrit") || 
            n.includes("लाभ") || n.includes("labh") || 
            n.includes("चर") || n.includes("char")) {
          return "shubh";
        }
        if (n.includes("रोग") || n.includes("rog") || 
            n.includes("काल") || n.includes("kaal") || 
            n.includes("उद्वेग") || n.includes("udveg")) {
          return "ashubh";
        }
        return "neutral";
      };

      const parseChoghadiya = (rawStr: any) => {
        if (!rawStr) return [];
        const text = String(rawStr).trim();
        if (!text) return [];

        const results: { name: string; start: string; end: string; type: string }[] = [];

        // Split entries by semicolon, comma, or newline if present
        const slots = text.includes(";") ? text.split(";") : text.split(/[\n,]+/);

        for (const rawSlot of slots) {
          const slot = rawSlot.trim();
          if (!slot) continue;

          // Pattern 1: Handles pipe-separated legacy format ("Shubh | 10:07 | 11:15 | Shubh")
          if (slot.includes("|")) {
            const parts = slot.split("|").map(p => p.trim());
            const name = parts[0] || "";
            const start = extractTime(parts[1] || "");
            const end = extractTime(parts[2] || "");
            const type = getChoghadiyaType(name, parts[3]);
            if (name) results.push({ name, start, end, type });
            continue;
          }

          // Pattern 2: Handles simple space-separated format ("Shubh 10:07 11:15" or "अमृत 06:08:37 07:43:14")
          const match = slot.match(/^([^\d]+)\s+(\d{1,2}:\d{2}(?::\d{2})?)\s+(\d{1,2}:\d{2}(?::\d{2})?)(?:\s+(.+))?$/);
          if (match) {
            const name = match[1].trim();
            const start = extractTime(match[2].trim());
            const end = extractTime(match[3].trim());
            const type = getChoghadiyaType(name, match[4]);
            results.push({ name, start, end, type });
          }
        }

        return results;
      };
      for (const row of rows) {
        const validDate = parseSafeDate(row.date);
        if (!validDate) continue;

        // Ensure every time field runs through `extractTime`
        const nestedJsonData = {
          day: validDate.toLocaleDateString('en-US', { weekday: 'long' }),
          sunrise: extractTime(row.sunrise), 
          sunset: extractTime(row.sunset),
          tithi: { details: { tithi_name: row.tithi_name || "" }, end_time: parseTime(row.tithi_end) },
          nakshatra: { details: { nak_name: row.nakshatra_name || "" }, end_time: parseTime(row.nakshatra_end) },
          yog: { details: { yog_name: row.yog_name || "" } },
          karan: { details: { karan_name: row.karan_name || "" } },
          hindu_maah: { purnimanta: row.hindu_maah || "" },
          paksha: row.paksha || "", ritu: row.ritu || "",
          sun_sign: row.sun_sign || "", moon_sign: row.moon_sign || "", ayana: row.ayana || "",
          vikram_samvat: parseInt(row.vikram_samvat) || 0, shaka_samvat: parseInt(row.shaka_samvat) || 0,
          abhijit_muhurta: { start: extractTime(row.abhijit_start), end: extractTime(row.abhijit_end) },
          rahukaal: { start: extractTime(row.rahukaal_start), end: extractTime(row.rahukaal_end) },
          choghadiya_day: parseChoghadiya(row.choghadiya_day),
          choghadiya_night: parseChoghadiya(row.choghadiya_night)
        };

        await prisma.panchang.upsert({
          where: { date: validDate },
          update: { data: nestedJsonData },
          create: { date: validDate, data: nestedJsonData }
        });
        successCount++;
      }
      return reply.send({ message: `Successfully imported ${successCount} entries!` });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: "Failed to process Excel file." });
    }
  });

  // 3. POST: Manual Form Entry
  server.post("/", async (request, reply) => {
    // 🚨 THIS IS THE FIX. If body is missing, it returns a 400 instead of crashing.
    if (!request.body) {
      return reply.code(400).send({ 
        error: "CRITICAL: Request body is missing! You are likely sending an Excel file to the manual route, or your frontend is missing the 'Content-Type: application/json' header." 
      });
    }

    const body = request.body as any;
    
    // Safely check if date exists in the parsed body
    if (!body.date || !body.data) {
      return reply.code(400).send({ error: "Missing 'date' or 'data' in JSON payload." });
    }

    try {
      const panchang = await prisma.panchang.upsert({
        where: { date: new Date(body.date) },
        update: { data: body.data },
        create: { date: new Date(body.date), data: body.data }
      });
      return reply.code(201).send({ message: "Saved manually!", panchang });
    } catch (error) {
      return reply.code(500).send({ error: "Failed to save manual data." });
    }
  });

  // 4. PUT: Update Existing Entry by ID
  server.put<{ Params: { id: string } }>("/:id", async (request, reply) => {
    if (!request.body) {
      return reply.code(400).send({ error: "Request body is missing." });
    }

    const body = request.body as any;
    
    if (!body.date || !body.data) {
      return reply.code(400).send({ error: "Missing 'date' or 'data'." });
    }

    try {
      const panchang = await prisma.panchang.update({
        where: { id: request.params.id },
        data: {
          date: new Date(body.date),
          data: body.data
        }
      });
      return reply.send({ message: "Panchang updated successfully!", panchang });
    } catch (error) {
      console.error("Update error:", error);
      return reply.code(500).send({ error: "Failed to update Panchang data." });
    }
  });

  // 5. DELETE: Remove Entry
  server.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      await prisma.panchang.delete({ where: { id: request.params.id } });
      return reply.send({ message: "Deleted." });
    } catch (error) {
      return reply.code(500).send({ error: "Failed to delete." });
    }
  });
}