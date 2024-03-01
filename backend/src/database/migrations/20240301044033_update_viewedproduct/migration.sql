/*
  Warnings:

  - You are about to drop the column `productId` on the `ViewedProduct` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_viewedProductId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "viewedProductId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ViewedProduct" DROP COLUMN "productId";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_viewedProductId_fkey" FOREIGN KEY ("viewedProductId") REFERENCES "ViewedProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
