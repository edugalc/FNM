/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Leccion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Leccion" DROP COLUMN "videoUrl";

-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "leccionId" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_leccionId_fkey" FOREIGN KEY ("leccionId") REFERENCES "Leccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
