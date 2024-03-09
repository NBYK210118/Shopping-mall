/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ViewedProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ViewedProduct_userId_key" ON "ViewedProduct"("userId");
