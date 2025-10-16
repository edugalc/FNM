-- AlterTable
ALTER TABLE "Curso" ADD COLUMN     "precio" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Carrito" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarritoItem" (
    "id" SERIAL NOT NULL,
    "carritoId" INTEGER NOT NULL,
    "cursoId" INTEGER,
    "ebookId" INTEGER,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarritoItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarritoItem_carritoId_cursoId_ebookId_key" ON "CarritoItem"("carritoId", "cursoId", "ebookId");

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarritoItem" ADD CONSTRAINT "CarritoItem_carritoId_fkey" FOREIGN KEY ("carritoId") REFERENCES "Carrito"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarritoItem" ADD CONSTRAINT "CarritoItem_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarritoItem" ADD CONSTRAINT "CarritoItem_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
