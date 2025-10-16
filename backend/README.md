# Meatec Backend (TypeScript + Prisma + PostgreSQL)

## Quick start

1. Install dependencies:
   npm install

2. Initialize Prisma (if not already):
   npx prisma init

   Then edit prisma/schema.prisma 

3. Run DB migrations (after schema):
   npx prisma migrate dev --name init

4. Start the dev server:
   npm run dev

Server runs at http://localhost:5000
Health: GET /api/health
