import { test } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import { reviewRoutes } from '../src/modules/review/review.routes';
import { prisma } from '../src/db';

test('public homepage reviews select no private fields; mobile review payload is accepted', async () => {
  const app = Fastify();
  await app.register(reviewRoutes, { prefix: '/reviews' });
  const find = prisma.review.findMany, create = prisma.review.create;
  let projection: any, submitted: any;
  prisma.review.findMany = (async args => { projection = args; return []; }) as typeof find;
  prisma.review.create = (async ({ data }: any) => { submitted = data; return { id: 'r1', ...data }; }) as typeof create;
  try {
    assert.equal((await app.inject('/reviews/featured')).statusCode, 200);
    assert.equal(projection.where.isApproved, true);
    assert.equal(projection.select.userPhone, undefined);
    assert.equal(projection.select.userId, undefined);
    const payload = { pujaId: 'p1', userName: 'Test', userPhone: '1234567890', rating: 5, comment: 'Good', userId: 'some-other-user' };
    assert.equal((await app.inject({ method: 'POST', url: '/reviews', payload })).statusCode, 201);
    assert.equal(submitted.isApproved, false);
    assert.equal(submitted.userId, null);
    assert.equal((await app.inject({ method: 'POST', url: '/reviews', payload: { ...payload, rating: 6 } })).statusCode, 400);
  } finally {
    prisma.review.findMany = find; prisma.review.create = create;
    await app.close();
  }
});
