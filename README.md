```txt
pnpm install
pnpm run dev
```

```txt
pnpm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
pnpm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## Project Structure

```txt
.
├── drizzle/
│   └── migrations/          # Drizzle migration files
├── plans/                   # Local planning notes, ignored by Git
├── src/
│   ├── core/                # Shared modules used across features
│   │   └── db/              # D1 + Drizzle setup and shared schema
│   ├── features/            # Domain feature modules
│   │   └── {domain}/
│   │       ├── route.ts
│   │       ├── service.ts
│   │       └── repository.ts
│   └── index.ts             # Worker entrypoint and root Hono app
├── drizzle.config.ts        # Drizzle Kit configuration
├── worker-configuration.d.ts # Generated Cloudflare runtime and binding types
└── wrangler.jsonc           # Cloudflare Worker and binding configuration
```

### Structure Rules

- Put shared infrastructure and reusable modules under `src/core`.
- Put domain-specific code under `src/features/{domain}`.
- Keep feature HTTP handlers in `route.ts`, business logic in `service.ts`, and data access in `repository.ts`.
- Keep local planning documents under `plans/`; this directory is intentionally ignored by Git.
