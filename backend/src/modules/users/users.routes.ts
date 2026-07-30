import { FastifyInstance } from 'fastify';
import { prisma } from '../../db';

export async function userRoutes(server: FastifyInstance) {
  // 1. Lock down this entire module
  server.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify(); // This checks the Authorization header
    } catch (err) {
      reply.send(err); // Throws 401 Unauthorized if token is missing/invalid
    }
  });

  // 2. Fetch the current logged-in user
  server.get('/me', async (request, reply) => {
    // request.user contains the decoded token payload we created during login
    const { userId } = request.user as { userId: string, role: string };
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Never return the password hash to the frontend
      select: { id: true, email: true, role: true, createdAt: true } 
    });

    if (!user) return reply.code(404).send({ error: 'User not found' });
    
    return { user };
  });
}