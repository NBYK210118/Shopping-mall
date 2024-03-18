/*
  Warnings:

  - You are about to drop the column `shoppingbasketId` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `ShoppingBasket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `finalPay` on the `ShoppingBasket` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `ShoppingBasket` table. All the data in the column will be lost.
  - You are about to drop the column `totalDiscount` on the `ShoppingBasket` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `ShoppingBasket` table. All the data in the column will be lost.
  - Added the required column `productId` to the `ShoppingBasket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_shoppingbasketId_fkey";

-- DropIndex
DROP INDEX "ShoppingBasket_userId_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "shoppingbasketId";

-- AlterTable
ALTER TABLE "ShoppingBasket" DROP CONSTRAINT "ShoppingBasket_pkey",
DROP COLUMN "finalPay",
DROP COLUMN "id",
DROP COLUMN "totalDiscount",
DROP COLUMN "totalPrice",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT "ShoppingBasket_pkey" PRIMARY KEY ("userId", "productId");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "basketSummaryId" INTEGER;

-- CreateTable
CREATE TABLE "cart_summary" (
    "userId" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL DEFAULT 0,
    "totalDiscount" INTEGER NOT NULL DEFAULT 0,
    "finalPay" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "cart_summary_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "ShoppingBasket" ADD CONSTRAINT "ShoppingBasket_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_summary" ADD CONSTRAINT "cart_summary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
