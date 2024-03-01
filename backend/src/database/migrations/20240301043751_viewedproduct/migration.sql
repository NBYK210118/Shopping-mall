/*
  Warnings:

  - Added the required column `viewedProductId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "viewedProductId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ViewedProduct" (
    "id" SERIAL NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ViewedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ViewedProduct_userId_key" ON "ViewedProduct"("userId");

-- AddForeignKey
ALTER TABLE "ViewedProduct" ADD CONSTRAINT "ViewedProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_viewedProductId_fkey" FOREIGN KEY ("viewedProductId") REFERENCES "ViewedProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
