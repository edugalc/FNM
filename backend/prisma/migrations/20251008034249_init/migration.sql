-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "PagoStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CursoUser" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CursoUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ebook" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "archivo" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ebookId" INTEGER,
    "cursoId" INTEGER,
    "status" "PagoStatus" NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CursoUser_cursoId_userId_key" ON "CursoUser"("cursoId", "userId");

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoUser" ADD CONSTRAINT "CursoUser_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoUser" ADD CONSTRAINT "CursoUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE SET NULL ON UPDATE CASCADE;
