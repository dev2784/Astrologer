import { FastifyInstance } from "fastify";
import { prisma } from "../../db";

export async function muhuratRoutes(server: FastifyInstance) {
  // Ensure OPTIONS preflight doesn't throw 404
  server.options("/*", async (request, reply) => {
    return reply.status(200).send();
  });

  // Get Muhurats (Public) - Filters by 'date' query parameter if passed, otherwise fetches all
  server.get("/", async (request, reply) => {
    const { date } = request.query as { date?: string };

    try {
      if (date) {
        // Parse date query parameter (expected YYYY-MM-DD)
        const queryDate = new Date(date);

        const muhurats = await prisma.muhurat.findMany({
          where: { date: queryDate },
          orderBy: { createdAt: "asc" },
        });

        return reply.send({ muhurats });
      }

      // Default: Fetch all muhurats ordered by date ascending
      const muhurats = await prisma.muhurat.findMany({
        orderBy: { date: "asc" },
      });

      return reply.send({ muhurats });
    } catch (error) {
      console.error("Fetch Muhurats error:", error);
      return reply.code(500).send({ error: "Failed to fetch muhurats." });
    }
  });

  // Create a new Muhurat entry (Admin)
  server.post("/", async (request, reply) => {
    const { date, tithi, muhurat, details } = request.body as any;

    if (!date || !tithi || !muhurat) {
      return reply
        .code(400)
        .send({ error: "Date, Tithi, and Muhurat timing are required." });
    }

    try {
      const newMuhurat = await prisma.muhurat.create({
        data: {
          date: new Date(date),
          tithi,
          muhurat,
          details: details || null,
        },
      });

      return reply
        .code(201)
        .send({ message: "Muhurat added successfully!", muhurat: newMuhurat });
    } catch (error) {
      console.error("Create Muhurat error:", error);
      return reply.code(500).send({ error: "Failed to create muhurat." });
    }
  });

  // Delete a Muhurat entry (Admin)
  server.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;

    if (!id) {
      return reply.code(400).send({ error: "Muhurat ID is required." });
    }

    try {
      await prisma.muhurat.delete({
        where: { id },
      });

      return reply.send({ message: "Muhurat deleted successfully." });
    } catch (error) {
      console.error("Delete Muhurat error:", error);
      return reply.code(500).send({ error: "Failed to delete muhurat." });
    }
  });


// Bulk Excel Upload for Muhurats
  server.post("/bulk-upload", async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.code(400).send({ error: "No Excel file uploaded." });
      }

      // Read file buffer into XLSX
      const buffer = await data.toBuffer();
      const workbook = XLSX.read(buffer, { type: "buffer" });
      
      // Get first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert sheet rows to JSON
      // Expected Excel columns: date, tithi, muhurat, details
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

      if (!rows || rows.length === 0) {
        return reply.code(400).send({ error: "Excel file is empty or formatted incorrectly." });
      }

      const recordsToCreate = rows
        .filter((row) => row.date && row.tithi && row.muhurat)
        .map((row) => ({
          date: new Date(row.date),
          tithi: String(row.tithi),
          muhurat: String(row.muhurat),
          details: row.details ? String(row.details) : null,
        }));

      if (recordsToCreate.length === 0) {
        return reply.code(400).send({ error: "No valid rows found. Ensure columns are named: date, tithi, muhurat, details" });
      }

      // Bulk create records in database
      const result = await prisma.muhurat.createMany({
        data: recordsToCreate,
        skipDuplicates: true,
      });

      return reply.send({
        message: `Successfully imported ${result.count} Muhurat entries!`,
        count: result.count,
      });
    } catch (error) {
      console.error("Bulk upload error:", error);
      return reply.code(500).send({ error: "Failed to process Excel file." });
    }
  });
}