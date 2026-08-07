import { FastifyInstance } from 'fastify';
import { prisma } from '../../db';

export async function reviewRoutes(server: FastifyInstance) {

  // ==========================================
  // PUBLIC ROUTES (Web App Users)
  // ==========================================

  // 1. GET Approved Reviews for a specific Puja
  server.get('/puja/:pujaId', async (request, reply) => {
    const { pujaId } = request.params as { pujaId: string };

    try {
      const reviews = await prisma.review.findMany({
        where: {
          pujaId,
          isApproved: true,
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userName: true,
          userCity: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      });

      const total = reviews.length;
      const avgRating = total > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1))
        : 0;

      return reply.send({ success: true, count: total, avgRating, reviews });
    } catch (error) {
      console.error('Fetch approved reviews error:', error);
      return reply.code(500).send({ error: 'Internal Server Error' });
    }
  });

  // 2. POST Submit a new Review (Pending Moderation)
  server.post('/', async (request, reply) => {
    const body = request.body as {
      pujaId: string;
      userName: string;
      userCity?: string;
      rating: number;
      comment: string;
      userId?: string;
    };

    const { pujaId, userName, userCity, rating, comment, userId } = body;

    if (!pujaId || !userName || !rating || !comment) {
      return reply.code(400).send({ error: 'Missing required fields: pujaId, userName, rating, and comment are mandatory.' });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return reply.code(400).send({ error: 'Rating must be an integer between 1 and 5.' });
    }

    try {
      const review = await prisma.review.create({
        data: {
          pujaId,
          userName,
          userCity: userCity || null,
          rating: numericRating,
          comment,
          userId: userId || null,
          isApproved: false, // Default: Pending approval
        },
      });

      return reply.code(201).send({
        success: true,
        message: 'Review submitted successfully. It will be visible after admin approval.',
        review,
      });
    } catch (error) {
      console.error('Submit review error:', error);
      return reply.code(400).send({ error: 'Failed to submit review.' });
    }
  });

  // ==========================================
  // ADMIN ROUTES
  // ==========================================

  // 3. GET All Reviews (Admin Dashboard)
  server.get('/admin/all', async (request, reply) => {
    const { status } = request.query as { status?: 'pending' | 'approved' | 'all' };

    const whereClause: any = {};
    if (status === 'pending') whereClause.isApproved = false;
    if (status === 'approved') whereClause.isApproved = true;

    try {
      const reviews = await prisma.review.findMany({
        where: whereClause,
        include: {
          puja: {
            select: { id: true, titleEn: true, titleHi: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return reply.send({ success: true, count: reviews.length, reviews });
    } catch (error) {
      console.error('Fetch admin reviews error:', error);
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