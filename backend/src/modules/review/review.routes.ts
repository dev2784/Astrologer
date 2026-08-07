import { FastifyInstance } from 'fastify';
import { prisma } from '../../db';

export async function reviewRoutes(server: FastifyInstance) {

  // 1. GET Approved Reviews for Public (PHONE NUMBER OMITTED)
  server.get('/puja/:pujaId', async (request, reply) => {
    const { pujaId } = request.params as { pujaId: string };

    try {
      const reviews = await prisma.review.findMany({
        where: { pujaId, isApproved: true },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userName: true,
          userCity: true,
          rating: true,
          comment: true,
          createdAt: true, // Note: userPhone is intentionally EXCLUDED here
        },
      });

      const total = reviews.length;
      const avgRating = total > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1))
        : 0;

      return reply.send({ success: true, count: total, avgRating, reviews });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // 2. POST Submit Review (Captures userPhone)
  server.post('/', async (request, reply) => {
    const body = request.body as {
      pujaId: string;
      userName: string;
      userPhone?: string;
      userCity?: string;
      rating: number;
      comment: string;
      userId?: string;
    };

    const { pujaId, userName, userPhone, userCity, rating, comment, userId } = body;

    if (!pujaId || !userName || !rating || !comment) {
      return reply.code(400).send({ error: 'Missing required fields: pujaId, userName, rating, and comment.' });
    }

    try {
      const review = await prisma.review.create({
        data: {
          pujaId,
          userName,
          userPhone: userPhone || null,
          userCity: userCity || null,
          rating: Number(rating),
          comment,
          userId: userId || null,
          isApproved: false,
        },
      });

      return reply.code(201).send({
        success: true,
        message: 'Review submitted successfully.',
        review,
      });
    } catch (error) {
      return reply.code(400).send({ error: 'Failed to submit review.' });
    }
  });

  // 3. GET Admin Reviews (INCLUDES userPhone for lead contact)
  server.get('/admin/all', async (request, reply) => {
    const { status } = request.query as { status?: 'pending' | 'approved' | 'all' };

    const whereClause: any = {};
    if (status === 'pending') whereClause.isApproved = false;
    if (status === 'approved') whereClause.isApproved = true;

    try {
      const reviews = await prisma.review.findMany({
        where: whereClause,
        include: {
          puja: { select: { id: true, titleEn: true, titleHi: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return reply.send({ success: true, count: reviews.length, reviews });
    } catch (error) {
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // 4. PATCH Approve / Hide a Review
  server.patch('/admin/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { isApproved } = request.body as { isApproved: boolean };

    if (typeof isApproved !== 'boolean') {
      return reply.code(400).send({ error: 'isApproved must be a boolean value.' });
    }

    try {
      const updated = await prisma.review.update({
        where: { id },
        data: { isApproved },
      });

      return reply.send({
        success: true,
        message: `Review ${isApproved ? 'approved' : 'hidden'} successfully.`,
        review: updated,
      });
    } catch (error) {
      console.error('Update review status error:', error);
      return reply.code(400).send({ error: 'Failed to update review status.' });
    }
  });

  // 5. DELETE a Review
  server.delete('/admin/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.review.delete({ where: { id } });
      return reply.send({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Delete review error:', error);
      return reply.code(400).send({ error: 'Failed to delete review.' });
    }
  });
}