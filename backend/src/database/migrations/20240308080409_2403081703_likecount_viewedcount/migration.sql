-- AlterTable
ALTER TABLE "UserProduct" ADD COLUMN     "liked_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ViewedProduct" ADD COLUMN     "viewed_count" INTEGER NOT NULL DEFAULT 0;
