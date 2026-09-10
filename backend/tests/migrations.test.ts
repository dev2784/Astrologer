import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';

test('migration history works on a fresh database and reconciliation preserves existing data', async () => {
  const db = new PGlite();
  try {
    const root = path.join(__dirname, '../prisma/migrations');
    const migrations = fs.readdirSync(root).filter(name => /^\d/.test(name)).sort();
    for (const name of migrations) await db.exec(fs.readFileSync(path.join(root, name, 'migration.sql'), 'utf8'));
    const columns = await db.query<{ table_name: string; column_name: string }>(
      "SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public'",
    );
    const fields = new Set(columns.rows.map(row => `${row.table_name}.${row.column_name}`));
    for (const field of ['User.phone', 'User.googleId', 'Booking.bookingDate', 'Review.userPhone', 'Muhurat.date', 'Panchang.data', 'Gallery.imageUrl', 'AboutSection.descriptionEn']) {
      assert.ok(fields.has(field), `Missing ${field}`);
    }
    await db.exec(`INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt") VALUES ('keep', 'keep@example.com', 'hash', 'ADMIN', now(), now())`);
    const reconcile = fs.readFileSync(path.join(root, '20260909120000_reconcile_missing_schema/migration.sql'), 'utf8');
    await db.exec(reconcile);
    assert.equal((await db.query<{ role: string }>('SELECT role FROM "User" WHERE id = \'keep\'')).rows[0].role, 'ADMIN');
  } finally {
    await db.close();
  }
});
