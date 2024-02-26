-- DropForeignKey
ALTER TABLE "SellingList" DROP CONSTRAINT "SellingList_storeId_fkey";

-- DropForeignKey
ALTER TABLE "SellingList" DROP CONSTRAINT "SellingList_userId_fkey";

-- AlterTable
ALTER TABLE "SellingList" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "storeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SellingList" ADD CONSTRAINT "SellingList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellingList" ADD CONSTRAINT "SellingList_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
