-- Paso 1: agregar la columna como NULL inicialmente
ALTER TABLE "public"."Product" ADD COLUMN "productCode" TEXT;

-- Paso 2: crear una tabla temporal con IDs y productCode generados
CREATE TEMP TABLE temp_product_codes AS
SELECT 
  "id",
  'PROD-' || LPAD(ROW_NUMBER() OVER (ORDER BY "createdAt")::text, 3, '0') AS "productCode"
FROM "public"."Product";

-- Paso 3: actualizar los productos usando JOIN con la tabla temporal
UPDATE "public"."Product"
SET "productCode" = temp."productCode"
FROM temp_product_codes temp
WHERE "public"."Product"."id" = temp."id";

-- Paso 4: hacer la columna NOT NULL
ALTER TABLE "public"."Product" ALTER COLUMN "productCode" SET NOT NULL;

-- Paso 5: agregar índice único
CREATE UNIQUE INDEX "Product_productCode_key" ON "public"."Product"("productCode");
