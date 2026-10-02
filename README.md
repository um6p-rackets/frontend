# Racket UM6P - Frontend

Web platform for managing racket-sport clubs at UM6P (1337 final project).
This repo is the **frontend**. It talks to the NestJS backend.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Redux, Docker

## Features

- Role-based dashboards (Visitor, Member, Leader, Coach)
- Club management
- Ranked matches and leaderboards
- Notifications

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

## Docker

```bash
docker build -t frontend:latest .
docker run -p 3015:3000 frontend:latest
```

Open http://localhost:3015

More details in [DEV.md](DEV.md).

## Structure

```
src/
  app/          pages and layouts
  components/   UI components
  lib/          helpers
public/         static assets
```