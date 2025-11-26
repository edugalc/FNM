/*
  Warnings:

  - A unique constraint covering the columns `[carritoId,cursoId,ebookId]` on the table `CarritoItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."CarritoItem_carritoId_cursoId_key";

-- DropIndex
DROP INDEX "public"."CarritoItem_carritoId_ebookId_key";

-- AlterTable
ALTER TABLE "Ebook" ADD COLUMN     "autor" TEXT,
ADD COLUMN     "descripcion" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "portada" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "CarritoItem_carritoId_cursoId_ebookId_key" ON "CarritoItem"("carritoId", "cursoId", "ebookId");
