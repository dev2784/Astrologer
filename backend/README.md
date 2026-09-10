# Backend checks and release configuration

Run `npm ci` in both `backend` and `webandadmin` before running the full regression suite. The web authentication integration tests use the web application's installed Next.js package.

```sh
npm test
npm run build
```

Tests use mocked application database methods and an isolated in-memory PostgreSQL instance (PGlite). They do not modify the configured application database.

The backend requires `DATABASE_URL` and a private, random `JWT_SECRET` of at least 32 characters. See `.env.example`. Generate a separate secret for each environment, for example with `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"`, and store it in that environment's secret configuration. Tokens expire after one day; changing the signing secret requires users to log in again.

The migration `20260909120000_reconcile_missing_schema` fills in schema changes missing from the older migration history. It has been tested against a fresh database and an already-current schema with existing test data. It has not been applied to the deployed database by this repair. Review the target database and its backup before running `npx prisma migrate deploy` during release. Do not use a database reset to apply this repair.

Coordinate backend and web/mobile release: admin clients now send bearer tokens, and homepages use `/reviews/featured` instead of the protected moderation endpoint. Google sign-in remains unavailable until a verified Google identity integration and its client configuration are supplied. Phone/email-password authentication remains supported; public registration always creates USER accounts.

Mobile builds may override their API URL with `EXPO_PUBLIC_API_BASE_URL`; web builds use `NEXT_PUBLIC_API_BASE_URL`. The existing mobile production URL remains the default.
