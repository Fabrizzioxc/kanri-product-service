import { Request, Response } from "express";
import * as categoryService from "../services/category.service";

export const getAll = async (req: Request, res: Response) => {
  const search = String(req.query.search || '')
  const page = parseInt(String(req.query.page || '1'), 10)
  const limit = parseInt(String(req.query.limit || '10'), 10)

  const result = await categoryService.getPaginated(search, page, limit)
  res.json(result)
}


export const getById = async (req: Request, res: Response) => {
  const category = await categoryService.getById(req.params.id);
  if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
  res.json(category);
};

export const create = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Datos inválidos", error });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.update(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: "Datos inválidos o ID incorrecto", error });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await categoryService.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Error al eliminar categoría", error });
  }
};
