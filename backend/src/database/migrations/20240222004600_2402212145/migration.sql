/*
  Warnings:

  - A unique constraint covering the columns `[wishlistId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sellinglistId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_wishlistId_key" ON "User"("wishlistId");

-- CreateIndex
CREATE UNIQUE INDEX "User_sellinglistId_key" ON "User"("sellinglistId");
