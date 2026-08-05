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
}