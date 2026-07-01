import { Hono } from 'hono'
import { createDb } from './db';
import { commandLogs } from './db/schema';

type Env = {
  DB: D1Database;
};
const app = new Hono<{ Bindings: Env }>();

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
