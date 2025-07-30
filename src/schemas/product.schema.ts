import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
});

export const ProductUpdateSchema = ProductSchema.partial();
