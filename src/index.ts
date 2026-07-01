import { Scalar } from '@scalar/hono-api-reference';
import { Hono } from 'hono'
import { createDb } from 'src/core/db';
import { commandLogs } from 'src/core/db/schema';
import { openApiDocument } from 'src/core/open-api/open-api.document';
import { usersRoute } from 'src/features/users/users.route';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/health', (c) => {
  return c.json({ ok: true });
});

app.get('/db-check', async (c) => {
  const db = createDb(c.env.DB);

  const logs = await db.select().from(commandLogs).limit(5);

  return c.json({
    ok: true,
    logs,
  });
});

app.get('/openapi.json', (c) => {
  return c.json(openApiDocument);
});

app.get('/docs', Scalar({
  pageTitle: '히어로즈 디코봇 API 문서',
  url: '/openapi.json',
}));

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/', usersRoute);

export default app
