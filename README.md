# 📦 Kanri - Product Service

**Descripción:**  
Microservicio encargado de la gestión de productos del sistema Kanri. Permite registrar, listar, editar y eliminar productos y categorías.

## 🚀 Tecnologías utilizadas
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod
- Dotenv

## 🧱 Modelo principal
- `Product`
- `Category`

## 📦 Comandos útiles

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

⚙️ .env de ejemplo

DATABASE_URL="postgresql://kanri:kanri123@localhost:5432/tu_basededatos?schema=public"
PORT=3001
