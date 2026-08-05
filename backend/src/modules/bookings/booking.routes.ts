import { FastifyInstance } from "fastify";
import { prisma } from '../../db';

export async function bookingRoutes(server: FastifyInstance) {

    // Ensure OPTIONS preflight doesn't throw 404
  server.options("/*", async (request, reply) => {
    return reply.status(200).send();
  });
  // Create a new booking (Public)
  server.post("/", async (request, reply) => {
    const { pujaId, name, phone, email, address, bookingDate } = request.body as any;

    if (!pujaId || !name || !phone || !address) {
      return reply.code(400).send({ error: "Name, Phone, Address, and Puja ID are required." });
    }

    try {
      const booking = await prisma.booking.create({
        data: {
          pujaId,
          name,
          phone,
          email: email || null,
          address,
          bookingDate ? new Date(bookingDate) : null,
        },
      });

      return reply.code(201).send({ message: "Booking submitted successfully!", booking });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: "Failed to process booking." });
    }
  });

  // Get all bookings (Admin)
  server.get("/", async (request, reply) => {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          puja: {
            select: { titleEn: true, titleHi: true, charges: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return reply.send({ bookings });
    } catch (error) {
      console.error(error);
      return reply.code(500).send({ error: "Failed to fetch bookings." });
    }
  });

  // Update booking status (Admin)
  server.patch<{ Params: { id: string }; Body: { status: string } }>(
    "/:id/status",
    async (request, reply) => {
      const { id } = request.params;
      const { status } = request.body;

      if (!id) {
        return reply.code(400).send({ error: "Booking ID is required." });
      }

      if (!["PENDING", "COMPLETED", "CANCELLED"].includes(status)) {
        return reply.code(400).send({ error: "Invalid status value." });
      }

      try {
        const updatedBooking = await prisma.booking.update({
          where: { id },
          data: { status },
        });

        return reply.send({ message: "Status updated successfully", booking: updatedBooking });
      } catch (error) {
        console.error("Database update error:", error);
        return reply.code(500).send({ error: "Failed to update booking status." });
      }
    }
  );
}