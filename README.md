# blokbyblok

BlokSchool — BlokBlok Studio's AI development education platform.

Built with Next.js 16 (App Router), TypeScript, Tailwind v4, NextAuth.js v5, Prisma v7, and PostgreSQL.

## Development

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build (runs `prisma generate` first)
- `npm run db:push` — sync schema to database
- `npm run db:seed` — seed courses and content
- `npm run db:studio` — open Prisma Studio
