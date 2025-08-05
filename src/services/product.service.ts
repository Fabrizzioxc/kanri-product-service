import { prisma } from "../utils/prisma";
import { ProductSchema, ProductUpdateSchema } from "../schemas/product.schema";

export type Filters = {
  search?: string;
  categoryId?: string;
  status?: string;
  stockStatus?: "normal" | "low" | "out";
  page?: number;
  limit?: number;
  order?: "asc" | "desc"; // ✅ aquí está la solución
};


export const getAll = async (filters: Filters = {}) => {
  const {
    search,
    categoryId,
    status,
    stockStatus,
    page = 1,
    limit = 10,
  } = filters

  const where: Record<string, any> = {}

  // Filtro por nombre
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    }
  }

  // Filtro por categoría
  if (categoryId) {
    where.categoryId = categoryId
  }

  // Filtro por estado
  if (status === "Activo" || status === "Inactivo") {
    where.status = status
  }

  // Filtro por stock
  if (stockStatus) {
    if (stockStatus === "normal") {
      where.stock = { gte: 11 }
    } else if (stockStatus === "low") {
      where.stock = { gt: 0, lt: 11 }
    } else if (stockStatus === "out") {
      where.stock = 0
    }
  }

  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true, // ✅ Para obtener el objeto completo de categoría
      },
      orderBy: {
  createdAt: filters.order === "asc" ? "asc" : "desc",
},
      skip,
      take: limit,
    }),
    prisma.product.count({
      where,
    }),
  ])

  return {
    data: products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

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

  const exists = await prisma.product.findFirst({
    where: { name: validated.name },
  });
  if (exists) throw new Error("Ya existe un producto con ese nombre.");

  // Obtener el último código existente
  const lastProduct = await prisma.product.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      productCode: true,
    },
    where: {
      productCode: {
        startsWith: "PROD-",
      },
    },
  });

  let nextNumber = 1;

  if (lastProduct?.productCode) {
    const match = lastProduct.productCode.match(/PROD-(\d+)/);
    if (match) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  const nextCode = `PROD-${String(nextNumber).padStart(3, "0")}`;

  return prisma.product.create({
    data: {
      ...validated,
      productCode: nextCode,
    },
  });
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

export const getOutOfStockProducts = async () => {
  return prisma.product.findMany({
    where: { stock: 0 },
    include: { category: true },
    orderBy: { name: "asc" },
  });
};
