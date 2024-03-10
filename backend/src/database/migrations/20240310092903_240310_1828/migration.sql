/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ViewedProduct` will be added. If there are existing duplicate values, this will fail.
  - Made the column `imageId` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_imageId_fkey";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "imageId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ViewedProduct_userId_key" ON "ViewedProduct"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
