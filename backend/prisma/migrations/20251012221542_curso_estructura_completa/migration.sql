/*
  Warnings:

  - The values [PENDING,COMPLETED,CANCELLED] on the enum `PagoStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[carritoId,cursoId]` on the table `CarritoItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[carritoId,ebookId]` on the table `CarritoItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TipoPregunta" AS ENUM ('OPCION_MULTIPLE', 'VERDADERO_FALSO', 'ABIERTA');

-- AlterEnum
BEGIN;
CREATE TYPE "PagoStatus_new" AS ENUM ('PENDIENTE', 'COMPLETADO', 'CANCELADO');
ALTER TABLE "Pago" ALTER COLUMN "status" TYPE "PagoStatus_new" USING ("status"::text::"PagoStatus_new");
ALTER TYPE "PagoStatus" RENAME TO "PagoStatus_old";
ALTER TYPE "PagoStatus_new" RENAME TO "PagoStatus";
DROP TYPE "public"."PagoStatus_old";
COMMIT;

-- DropIndex
DROP INDEX "public"."CarritoItem_carritoId_cursoId_ebookId_key";

-- CreateTable
CREATE TABLE "Seccion" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leccion" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT,
    "videoUrl" TEXT,
    "seccionId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cuestionario" (
    "id" SERIAL NOT NULL,
    "leccionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cuestionario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pregunta" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" "TipoPregunta" NOT NULL DEFAULT 'OPCION_MULTIPLE',
    "cuestionarioId" INTEGER NOT NULL,
    "respuestaCorrecta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opcion" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "esCorrecta" BOOLEAN NOT NULL DEFAULT false,
    "preguntaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cuestionario_leccionId_key" ON "Cuestionario"("leccionId");

-- CreateIndex
CREATE UNIQUE INDEX "CarritoItem_carritoId_cursoId_key" ON "CarritoItem"("carritoId", "cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "CarritoItem_carritoId_ebookId_key" ON "CarritoItem"("carritoId", "ebookId");

-- AddForeignKey
ALTER TABLE "Seccion" ADD CONSTRAINT "Seccion_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leccion" ADD CONSTRAINT "Leccion_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cuestionario" ADD CONSTRAINT "Cuestionario_leccionId_fkey" FOREIGN KEY ("leccionId") REFERENCES "Leccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pregunta" ADD CONSTRAINT "Pregunta_cuestionarioId_fkey" FOREIGN KEY ("cuestionarioId") REFERENCES "Cuestionario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opcion" ADD CONSTRAINT "Opcion_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "Pregunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
