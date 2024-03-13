/*
  Warnings:

  - You are about to drop the `StoreUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[storeId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "StoreUser" DROP CONSTRAINT "StoreUser_storeId_fkey";

-- DropForeignKey
ALTER TABLE "StoreUser" DROP CONSTRAINT "StoreUser_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "storeId" INTEGER;

-- DropTable
DROP TABLE "StoreUser";

-- CreateIndex
CREATE UNIQUE INDEX "User_storeId_key" ON "User"("storeId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
