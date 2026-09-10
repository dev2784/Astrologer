import { test } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { registerAuthorization } from '../src/security';
import { authRoutes } from '../src/modules/auth/auth.routes';
import { prisma } from '../src/db';

test('admin authorization protects reads and mutations without blocking public flows', async () => {
  const app = Fastify();
  await app.register(jwt, { secret: 'test-only-secret-not-used-in-production', sign: { expiresIn: '1d' } });
  registerAuthorization(app, async id => id === 'admin' ? { role: 'ADMIN' } : { role: 'USER' });
  const protectedRoutes = [
    ['GET', '/bookings/'], ['GET', '/users'], ['HEAD', '/users'],
    ['GET', '/reviews/admin/all'], ['PATCH', '/reviews/admin/:id/status'],
    ['DELETE', '/categories/:id'], ['POST', '/uploads/'], ['PUT', '/pujas/:id'],
    ['POST', '/panchang/bulk-upload'], ['PUT', '/about/'],
  ] as const;
  for (const [method, url] of protectedRoutes) {
    if (method !== 'HEAD') app.route({ method, url, handler: async () => ({ ok: true }) });
  }
  for (const url of ['/bookings/', '/reviews/', '/auth/login', '/auth/register', '/auth/google']) {
    app.post(url, async () => ({ ok: true }));
  }
  app.get('/pujas/', async () => ({ ok: true }));
  const admin = app.jwt.sign({ userId: 'admin', role: 'ADMIN' });
  const user = app.jwt.sign({ userId: 'user', role: 'ADMIN' }); // claimed role must not override DB
  const expired = app.jwt.sign({ userId: 'admin' }, { expiresIn: -1 });
  for (const [method, route] of protectedRoutes) {
    const url = route.replace(':id', '1');
    assert.equal((await app.inject({ method, url })).statusCode, 401, route);
    assert.equal((await app.inject({ method, url, headers: { authorization: 'Bearer ' + user } })).statusCode, 403, route);
    assert.equal((await app.inject({ method, url, headers: { authorization: 'Bearer ' + expired } })).statusCode, 401, route);
    assert.equal((await app.inject({ method, url, headers: { authorization: 'Bearer ' + admin } })).statusCode, 200, route);
  }
  for (const url of ['/bookings/', '/reviews/', '/auth/login', '/auth/register', '/auth/google']) {
    assert.equal((await app.inject({ method: 'POST', url })).statusCode, 200, url);
  }
  assert.equal((await app.inject('/pujas/')).statusCode, 200);
  await app.close();
});

test('registration cannot grant admin and Google identity cannot be supplied as email', async () => {
  const app = Fastify();
  await app.register(jwt, { secret: 'test-only-secret-not-used-in-production', sign: { expiresIn: '1d' } });
  await app.register(authRoutes, { prefix: '/auth' });
  const originalFind = prisma.user.findFirst;
  const originalCreate = prisma.user.create;
  let createdRole: string | undefined;
  prisma.user.findFirst = (async () => null) as typeof prisma.user.findFirst;
  prisma.user.create = (async ({ data }: any) => {
    createdRole = data.role;
    return { ...data, id: 'test-user' };
  }) as typeof prisma.user.create;
  try {
    const res = await app.inject({ method: 'POST', url: '/auth/register', payload: {
      name: 'Test', phone: '1234567890', password: 'test-password', role: 'ADMIN',
    } });
    assert.equal(res.statusCode, 201);
    assert.equal(createdRole, 'USER');
    const token = app.jwt.verify<{ exp: number; iat: number }>(res.json().token);
    assert.equal(token.exp - token.iat, 86400);
    assert.equal((await app.inject({ method: 'POST', url: '/auth/google', payload: { email: 'admin@example.com' } })).statusCode, 503);
    assert.equal((await app.inject({ method: 'POST', url: '/auth/login', payload: { phone: '1234567890' } })).statusCode, 400);
    assert.equal((await app.inject({ method: 'POST', url: '/auth/register', payload: { phone: '1234567890' } })).statusCode, 400);
  } finally {
    prisma.user.findFirst = originalFind;
    prisma.user.create = originalCreate;
    await app.close();
    await prisma.$disconnect();
  }
});
