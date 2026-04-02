# Goal Tracking OS

A production-minded, single-page goal tracking dashboard built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and NeonDB.

## What It Includes

- One-page dark workspace for yearly, quarterly, monthly, and weekly goals
- Expandable hierarchy tree with inline progress updates
- Quarterly tracker, summary metrics, and weekly focus panel
- GitHub-style execution heatmap backed by persisted activity data
- Prisma schema and migration-ready database setup
- Server actions for create, update, delete, complete, and progress mutation flows

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Prisma 7
- Neon Postgres
- TypeScript

## Local Run

`DATABASE_URL` is expected in `.env`.

```bash
npm install
npm run prisma:generate
npx prisma migrate dev --name init_goal_tracking
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
npm run dev
npm run lint
npm run build
npm run prisma:generate
npm run prisma:migrate -- --name your_migration_name
```
