import { FastifyInstance } from 'fastify';
import { prisma } from '../../db';

export async function usersRoutes(server: FastifyInstance) {
  
  // Get current logged-in user profile
  server.get('/me', {
    preValidation: [server.authenticate] // Assuming you have a JWT middleware decorator
  }, async (request, reply) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: request.user.userId },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
      });

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      return reply.send({ success: true, user });
    } catch (error) {
      return reply.code(500).send({ error: 'Failed to fetch profile' });
    }
  });

  // Add any other profile-updating routes here (e.g., PUT /me)...
}