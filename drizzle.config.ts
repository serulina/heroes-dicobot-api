import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: 'src/core/db/schema.ts',
  out: 'drizzle/migrations',
  dialect: 'sqlite',
});
