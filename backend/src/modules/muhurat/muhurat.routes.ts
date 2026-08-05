import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from '../../db';

interface MuhuratBody {
  date: string; // YYYY-MM-DD
  tithi: string;
  muhurat: string;
  details?: string;
}

export async function muhuratRoutes(fastify: FastifyInstance) {
  // Public: Get muhurats by date (or all upcoming)
  fastify.get("/muhurat", async (req: FastifyRequest, reply: FastifyReply) => {
    const { date } = req.query as { date?: string };

    if (date) {
      // Parse ISO date
      const queryDate = new Date(date);
      const muhurats = await prisma.muhurat.findMany({
        where: { date: queryDate },
        orderBy: { createdAt: "asc" },
      });
      return reply.send({ muhurats });
    }

    // Default: fetch all muhurats
    const muhurats = await prisma.muhurat.findMany({
      orderBy: { date: "asc" },
    });
    return reply.send({ muhurats });
  });

  // Admin: Create new Muhurat
  fastify.post("/admin/muhurat", async (req: FastifyRequest, reply: FastifyReply) => {
    const { date, tithi, muhurat, details } = req.body as MuhuratBody;

    if (!date || !tithi || !muhurat) {
      return reply.status(400).send({ error: "Date, Tithi, and Muhurat are required." });
    }

    const newMuhurat = await prisma.muhurat.create({
      data: {
        date: new Date(date),
        tithi,
        muhurat,
        details: details || null,
      },
    });

    return reply.status(201).send({ success: true, muhurat: newMuhurat });
  });

  // Admin: Delete Muhurat
  fastify.delete("/admin/muhurat/:id", async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };

    await prisma.muhurat.delete({
      where: { id },
    });

    return reply.send({ success: true, message: "Muhurat deleted successfully" });
  });
}