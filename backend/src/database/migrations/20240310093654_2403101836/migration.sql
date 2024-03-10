-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_imageId_fkey";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "imageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
