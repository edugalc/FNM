/*
  Warnings:

  - A unique constraint covering the columns `[stripeSessionId]` on the table `Pago` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripePaymentIntent" TEXT,
ADD COLUMN     "stripeSessionId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDIENTE';

-- CreateIndex
CREATE UNIQUE INDEX "Pago_stripeSessionId_key" ON "Pago"("stripeSessionId");
