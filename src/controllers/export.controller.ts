import { Request, Response } from "express";
import { exportProductsToExcel } from "../services/export.service";

export const exportToExcel = async (req: Request, res: Response) => {
  try {
    const buffer = await exportProductsToExcel(); // Aquí puedes pasar filtros si deseas
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=Reporte de productos - Kanri.xlsx");
    res.send(buffer);
  } catch (error) {
    console.error("Error al exportar productos:", error);
    res.status(500).json({ message: "Error al exportar productos a Excel" });
  }
};
