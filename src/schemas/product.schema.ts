import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(), // 👈 Añadido aquí
  categoryId: z.string().uuid(),
});

export const ProductUpdateSchema = ProductSchema.partial();
