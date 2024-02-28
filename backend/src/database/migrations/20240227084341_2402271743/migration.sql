/*
  Warnings:

  - The `wishListId` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_wishListId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "wishListId",
ADD COLUMN     "wishListId" INTEGER[];

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_wishListId_fkey" FOREIGN KEY ("wishListId") REFERENCES "WishList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
