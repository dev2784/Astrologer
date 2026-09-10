import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from '../../webandadmin/node_modules/next/server';
import { middleware } from '../../webandadmin/middleware';
import { adminFetch } from '../../webandadmin/lib/admin-api';

test('admin middleware verifies roles and avoids invalid-cookie redirect loops', async () => {
  const original = globalThis.fetch;
  try {
    const request = (path: string, token?: string) => new NextRequest('http://localhost:3000' + path, {
      headers: token ? { cookie: 'token=' + token } : {},
    });
    let role = 'USER', status = 200;
    globalThis.fetch = async () => new Response(JSON.stringify({ user: { role } }), { status });
    assert.equal((await middleware(request('/admin/dashboard'))).headers.get('location'), 'http://localhost:3000/admin');
    assert.equal((await middleware(request('/admin/dashboard', 'normal-user'))).headers.get('location'), 'http://localhost:3000/admin');
    status = 401;
    const invalidLogin = await middleware(request('/admin', 'expired'));
    assert.equal(invalidLogin.headers.get('location'), null);
    assert.match(invalidLogin.headers.get('set-cookie')!, /token=;/);
    status = 200; role = 'ADMIN';
    assert.equal((await middleware(request('/admin', 'admin'))).headers.get('location'), 'http://localhost:3000/admin/dashboard');
    assert.equal((await middleware(request('/admin/dashboard', 'admin'))).headers.get('location'), null);
  } finally { globalThis.fetch = original; }
});

test('admin API requests retain multipart bodies and clear expired sessions', async () => {
  const globals = globalThis as any;
  const saved = { fetch: globals.fetch, localStorage: globals.localStorage, window: globals.window, document: globals.document };
  let token: string | null = 'admin-token', redirect = '';
  globals.localStorage = { getItem: () => token, removeItem: () => { token = null; } };
  globals.document = { cookie: '' };
  globals.window = { location: { assign: (url: string) => { redirect = url; } } };
  try {
    const body = new FormData(); body.append('file', new Blob(['test']), 'test.txt');
    globals.fetch = async (_url: string, init: RequestInit) => {
      assert.equal(new Headers(init.headers).get('Authorization'), 'Bearer admin-token');
      assert.equal(new Headers(init.headers).get('Content-Type'), null);
      assert.equal(init.body, body);
      return new Response('{}');
    };
    assert.equal((await adminFetch('http://localhost:8080/uploads', { method: 'POST', body })).status, 200);
    globals.fetch = async () => new Response('{}', { status: 401 });
    await assert.rejects(adminFetch('http://localhost:8080/bookings'), /Session expired/);
    assert.equal(token, null); assert.equal(redirect, '/admin');
  } finally { Object.assign(globals, saved); }
});
