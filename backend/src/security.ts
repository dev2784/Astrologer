import type { FastifyInstance } from 'fastify';

type LookupUser = (id: string) => Promise<{ role: string } | null>;

// Public reads and guest booking/review submissions remain available.
export function registerAuthorization(server: FastifyInstance, lookupUser: LookupUser) {
  server.addHook('onRequest', async (request, reply) => {
    const route = (request.routeOptions.url || '').replace(/\/$/, '');
    const method = request.method;
    if (method === 'OPTIONS' || !route) return;
    const privateRead = ['GET', 'HEAD'].includes(method) &&
      (route === '/users' || route === '/bookings' || route.startsWith('/reviews/admin/'));
    const publicPost = method === 'POST' && ['/auth/register', '/auth/login', '/auth/google', '/bookings', '/reviews'].includes(route);
    const mutation = !['GET', 'HEAD'].includes(method) && !publicPost;
    if (!privateRead && !mutation) return;

    let userId: string;
    try {
      const payload = await request.jwtVerify<{ userId: string }>();
      if (typeof payload.userId !== 'string') throw new Error('Invalid subject');
      userId = payload.userId;
    } catch {
      return reply.code(401).send({ error: 'Please log in again.' });
    }
    // Check the current database role, so removed/demoted admins lose access.
    const user = await lookupUser(userId);
    if (!user || user.role !== 'ADMIN') {
      return reply.code(403).send({ error: 'Admin privileges required.' });
    }
  });
}
