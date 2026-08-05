import { FastifyInstance } from "fastify";
import { prisma } from "../../db";
import * as XLSX from "xlsx"; 


export async function panchangRoutes(server: FastifyInstance) {
  // ADMIN: Manual Single Upload/Update
  server.post("/", async (request, reply) => {
    const { date, data } = request.body as { date: string; data: any };

    if (!date || !data) {
      return reply.code(400).send({ error: "Date and Panchang data are required." });
    }

    try {
      const panchang = await prisma.panchang.upsert({
        where: { date: new Date(date) },
        update: { data },
        create: {
          date: new Date(date),
          data
        }
      });

      return reply.code(201).send({ message: "Panchang saved successfully!", panchang });
    } catch (error) {
      console.error("Manual Panchang Error:", error);
      return reply.code(500).send({ error: "Failed to save Panchang data." });
    }
  });

  // 1. GET: Fetch Panchang (List for Admin, or Single Date for Public UI)
  server.get("/", async (request, reply) => {
    const { date } = request.query as { date?: string };

    try {
      if (date) {
        // Fetch single date for public UI
        const panchang = await prisma.panchang.findUnique({
          where: { date: new Date(date) },
        });

        if (!panchang) {
          return reply.code(404).send({ error: "No Panchang data found for this date." });
        }
        return reply.send({ data: panchang.data });
      }

      // If no date passed, fetch ALL data for Admin List view (Ordered by newest date)
      const list = await prisma.panchang.findMany({
        orderBy: { date: "desc" },
      });
      return reply.send({ list });

    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: "Database error" });
    }
  });

  // 2. DELETE: Remove a Panchang Entry
  server.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;

    if (!id) return reply.code(400).send({ error: "Panchang ID is required." });

    try {
      await prisma.panchang.delete({
        where: { id },
      });
      return reply.send({ message: "Panchang entry deleted successfully." });
    } catch (error) {
      console.error("Delete Panchang error:", error);
      return reply.code(500).send({ error: "Failed to delete Panchang entry." });
    }
  });
}