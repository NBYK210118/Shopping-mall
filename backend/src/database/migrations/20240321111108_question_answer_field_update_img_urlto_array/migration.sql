/*
  Warnings:

  - The `imgUrl` column on the `Answer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `imgUrl` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "imgUrl",
ADD COLUMN     "imgUrl" TEXT[];

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "imgUrl",
ADD COLUMN     "imgUrl" TEXT[];
