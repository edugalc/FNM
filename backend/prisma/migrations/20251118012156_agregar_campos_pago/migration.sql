-- CreateTable
CREATE TABLE "EbookUser" (
    "id" SERIAL NOT NULL,
    "ebookId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EbookUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EbookUser_ebookId_userId_key" ON "EbookUser"("ebookId", "userId");

-- AddForeignKey
ALTER TABLE "EbookUser" ADD CONSTRAINT "EbookUser_ebookId_fkey" FOREIGN KEY ("ebookId") REFERENCES "Ebook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EbookUser" ADD CONSTRAINT "EbookUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
