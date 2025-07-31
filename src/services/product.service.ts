import { prisma } from "../utils/prisma";
import { ProductSchema, ProductUpdateSchema } from "../schemas/product.schema";

export const getAll = () => {
  return prisma.product.findMany({ include: { category: true } });
};

export const getById = (id: string) => {
  return prisma.product.findUnique({ where: { id }, include: { category: true } });
};

export const create = async (data: unknown) => {
  const validated = ProductSchema.parse(data);
  return prisma.product.create({ data: validated });
};

export const update = async (id: string, data: unknown) => {
  const validated = ProductUpdateSchema.parse(data);
  return prisma.product.update({ where: { id }, data: validated });
};

export const remove = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) throw new Error("Producto no encontrado.");
  await prisma.product.delete({ where: { id } });
};

