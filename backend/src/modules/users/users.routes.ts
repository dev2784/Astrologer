import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../db';

export async function usersRoutes(server: FastifyInstance) {
  
  // Get current logged-in user profile
  server.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 1. Manually verify the JWT token (throws error if invalid/missing)
      await request.jwtVerify();

      // 2. Explicitly type the JWT payload so TypeScript stops complaining
      const decodedToken = request.user as { userId: string; role: string };

      // 3. Fetch the user using the typed userId
      const user = await prisma.user.findUnique({
        where: { id: decodedToken.userId },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }
      });

      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      return reply.send({ success: true, user });
    } catch (error) {
      // Catch token verification failures or database errors
      return reply.code(401).send({ error: 'Unauthorized or invalid token' });
    }
  });

  // Add any other profile-updating routes here (e.g., PUT /me)...
}