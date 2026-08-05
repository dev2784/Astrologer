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
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const rows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (!rows || rows.length === 0) return reply.code(400).send({ error: "Excel file is empty." });

      let successCount = 0;
      const parseTime = (timeStr: string) => {
        if (!timeStr) return { hour: 0, minute: 0, second: 0 };
        const parts = String(timeStr).split(":");
        return { hour: parseInt(parts[0] || "0"), minute: parseInt(parts[1] || "0"), second: parseInt(parts[2] || "0") };
      };

      const parseChoghadiya = (rawStr: string) => {
        if (!rawStr) return [];
        return rawStr.split(";").map(slot => {
          const [name, start, end, type] = slot.split("|");
          return { name: name || "", start: start || "", end: end || "", type: type || "neutral" };
        });
      };

      for (const row of rows) {
        if (!row.date) continue;

        const nestedJsonData = {
          day: new Date(row.date).toLocaleDateString('en-US', { weekday: 'long' }),
          sunrise: row.sunrise || "", sunset: row.sunset || "",
          tithi: { details: { tithi_name: row.tithi_name || "" }, end_time: parseTime(row.tithi_end) },
          nakshatra: { details: { nak_name: row.nakshatra_name || "" }, end_time: parseTime(row.nakshatra_end) },
          yog: { details: { yog_name: row.yog_name || "" } },
          karan: { details: { karan_name: row.karan_name || "" } },
          hindu_maah: { purnimanta: row.hindu_maah || "" },
          paksha: row.paksha || "", ritu: row.ritu || "",
          sun_sign: row.sun_sign || "", moon_sign: row.moon_sign || "", ayana: row.ayana || "",
          vikram_samvat: parseInt(row.vikram_samvat) || 0, shaka_samvat: parseInt(row.shaka_samvat) || 0,
          abhijit_muhurta: { start: row.abhijit_start || "", end: row.abhijit_end || "" },
          rahukaal: { start: row.rahukaal_start || "", end: row.rahukaal_end || "" },
          // THIS IS THE NEW ADDITION:
          choghadiya_day: parseChoghadiya(row.choghadiya_day),
          choghadiya_night: parseChoghadiya(row.choghadiya_night)
        };

        await prisma.panchang.upsert({
          where: { date: new Date(row.date) },
          update: { data: nestedJsonData },
          create: { date: new Date(row.date), data: nestedJsonData }
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