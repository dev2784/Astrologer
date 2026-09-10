import { test } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import { pujaRoutes } from '../src/modules/pujas/pujas.routes';
import { prisma } from '../src/db';
import { cleanRichText } from '../src/rich-text';

test('rich text preserves formatting while removing executable content', () => {
  const clean = cleanRichText('<p class="ql-align-center"><strong>पूजा</strong><a href="javascript:alert(1)">link</a><img src=x onerror=alert(1)><script>alert(1)</script></p>');
  assert.match(clean!, /<strong>पूजा<\/strong>/);
  assert.match(clean!, /ql-align-center/);
  assert.doesNotMatch(clean!, /javascript:|onerror|<script|<img/);
});

test('subcategory filtering reaches both the list and count; old stored HTML is sanitized', async () => {
  const app = Fastify();
  await app.register(pujaRoutes, { prefix: '/pujas' });
  const originalFind = prisma.puja.findMany, originalCount = prisma.puja.count;
  const calls: any[] = [];
  prisma.puja.findMany = (async args => {
    calls.push(args);
    return [{ id: '1', about: '<script>bad()</script><p>Good</p>' }];
  }) as typeof prisma.puja.findMany;
  prisma.puja.count = (async args => { calls.push(args); return 1; }) as typeof prisma.puja.count;
  try {
    const res = await app.inject('/pujas?subcategoryId=sub-1');
    assert.equal(res.statusCode, 200);
    assert.equal(calls[0].where.subcategoryId, 'sub-1');
    assert.equal(calls[1].where.subcategoryId, 'sub-1');
    assert.equal(res.json().pujas[0].about, '<p>Good</p>');
  } finally {
    prisma.puja.findMany = originalFind; prisma.puja.count = originalCount;
    await app.close();
  }
});

test('failed puja update does not separately delete existing FAQs', async () => {
  const app = Fastify();
  await app.register(pujaRoutes, { prefix: '/pujas' });
  const originalUpdate = prisma.puja.update, originalDelete = prisma.pujaFaq.deleteMany;
  let deleted = false, update: any;
  prisma.pujaFaq.deleteMany = (async () => { deleted = true; return { count: 1 }; }) as typeof prisma.pujaFaq.deleteMany;
  prisma.puja.update = (async args => { update = args; throw new Error('Simulated constraint failure'); }) as typeof prisma.puja.update;
  try {
    const res = await app.inject({ method: 'PUT', url: '/pujas/1', payload: { titleEn: 'Changed', faqs: [] } });
    assert.equal(res.statusCode, 400);
    assert.equal(deleted, false);
    assert.deepEqual(update.data.faqs.deleteMany, {});
  } finally {
    prisma.puja.update = originalUpdate; prisma.pujaFaq.deleteMany = originalDelete;
    await app.close();
  }
});
