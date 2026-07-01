import { Hono } from 'hono'
import { createDb } from './core/db';
import { commandLogs } from './core/db/schema';

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

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
