/*
  Warnings:

  - You are about to drop the column `liked_count` on the `UserProduct` table. All the data in the column will be lost.
  - You are about to drop the column `viewed_count` on the `ViewedProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProduct" DROP COLUMN "liked_count";

-- AlterTable
ALTER TABLE "ViewedProduct" DROP COLUMN "viewed_count";
