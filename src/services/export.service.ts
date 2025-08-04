import ExcelJS from "exceljs";
import { getAll } from "./product.service";
import { Filters } from "./product.service";

export const exportProductsToExcel = async (filters: Filters = {}) => {
  const result = await getAll({ ...filters, limit: 9999 });

  const workbook = new ExcelJS.Workbook();
  const dateNow = new Date();

  const formattedDate = dateNow.toLocaleString("es-PE", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const sheetTitle = `Reporte de productos - Kanri ${dateNow
    .toISOString()
    .split("T")[0]}`;

  const worksheet = workbook.addWorksheet(sheetTitle);

  // === 1. Cabecera ===
  worksheet.mergeCells("A1:H1");
  worksheet.getCell("A1").value = "Kanri: Reporte de Inventario de Productos";
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "FFFFFF" } };
  worksheet.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "F97316" }, // naranja
  };

  worksheet.getRow(1).height = 30;

  worksheet.getCell("A3").value = "Exportado por:";
  worksheet.getCell("A3").font = { bold: true };
  worksheet.getCell("B3").value = "Administrador";

  worksheet.getCell("E3").value = "Fecha de generación:";
  worksheet.getCell("E3").font = { bold: true };
  worksheet.getCell("F3").value = formattedDate;

  // === 2. Encabezado de tabla ===
  const headerRowIndex = 5;
  const headers = [
    "N°",
    "ID",
    "Código",
    "Nombre",
    "Categoría",
    "Stock",
    "Estado",
    "Creado",
  ];
  worksheet.getRow(headerRowIndex).values = headers;
  const headerRow = worksheet.getRow(headerRowIndex);

  headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "F97316" },
  };

  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  worksheet.columns = [
    { key: "number", width: 5 },
    { key: "id", width: 30 },
    { key: "productCode", width: 15 },
    { key: "name", width: 25 },
    { key: "category", width: 20 },
    { key: "stock", width: 10 },
    { key: "status", width: 12 },
    { key: "createdAt", width: 20 },
  ];

  let totalStock = 0;

  result.data.forEach((product, index) => {
    const row = worksheet.addRow({
      number: index + 1,
      id: product.id,
      productCode: product.productCode,
      name: product.name,
      category: product.category?.name ?? "Sin categoría",
      stock: product.stock,
      status: product.status,
      createdAt: new Date(product.createdAt).toLocaleString("es-PE", {
        timeZone: "America/Lima",
      }),
    });

    const bgColor = product.status === "Activo" ? "FDF6E3" : "F8CBAD";

    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: bgColor },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    totalStock += product.stock;
  });

  const summaryRowIndex = worksheet.lastRow!.number + 2;

  worksheet.mergeCells(`A${summaryRowIndex}:B${summaryRowIndex}`);
  worksheet.getCell(`A${summaryRowIndex}`).value = `Total de productos: ${result.data.length}`;
  worksheet.getCell(`A${summaryRowIndex}`).font = { bold: true };
  worksheet.getCell(`A${summaryRowIndex}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "C6EFCE" }, // verde claro
  };

  worksheet.mergeCells(`E${summaryRowIndex}:F${summaryRowIndex}`);
  worksheet.getCell(`E${summaryRowIndex}`).value = `Total de Stock de Productos: ${totalStock}`;
  worksheet.getCell(`E${summaryRowIndex}`).font = { bold: true };
  worksheet.getCell(`E${summaryRowIndex}`).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "C6EFCE" },
  };

  const footerRowIndex = summaryRowIndex + 2;
  worksheet.mergeCells(`A${footerRowIndex}:D${footerRowIndex}`);
  worksheet.getCell(`A${footerRowIndex}`).value = "Excel generado por Kanri.";
  worksheet.getCell(`A${footerRowIndex}`).font = { italic: true };

  worksheet.mergeCells(`E${footerRowIndex}:H${footerRowIndex}`);
  worksheet.getCell(`E${footerRowIndex}`).value = "Para más detalles, visita: www.kanri.com";
  worksheet.getCell(`E${footerRowIndex}`).font = { italic: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
