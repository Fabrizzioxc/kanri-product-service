import { prisma } from "../utils/prisma";
import { ProductSchema, ProductUpdateSchema } from "../schemas/product.schema";

type Filters = {
  search?: string;
  categoryId?: string;
  status?: string;
  stockStatus?: "normal" | "low" | "out";
  page?: number;
  limit?: number;
};

export const getAll = async (filters: Filters = {}) => {
  const { search, categoryId, status, stockStatus, page = 1, limit = 10 } = filters;

  const where: any = {};

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (status === "Activo" || status === "Inactivo") {
    where.status = status;
  }

  if (stockStatus) {
    if (stockStatus === "normal") {
      where.stock = { gte: 11 };
    } else if (stockStatus === "low") {
      where.stock = { gt: 0, lt: 11 };
    } else if (stockStatus === "out") {
      where.stock = 0;
    }
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getLowStockProducts = async () => {
  return prisma.product.findMany({
    where: { stock: { lt: 10 } },
    include: { category: true },
    orderBy: { stock: 'asc' },
  });
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
