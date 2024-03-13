/*
  Warnings:

  - You are about to drop the column `storeId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_storeId_fkey";

-- DropIndex
DROP INDEX "User_storeId_key";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountPrice" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "storeId";
