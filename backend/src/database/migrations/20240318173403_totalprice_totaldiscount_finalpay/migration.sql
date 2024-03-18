-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "discountPrice" SET DEFAULT 0,
ALTER COLUMN "discountRatio" SET DEFAULT 0,
ALTER COLUMN "isDiscounting" SET DEFAULT false;

-- AlterTable
ALTER TABLE "ShoppingBasket" ADD COLUMN     "finalPay" INTEGER,
ADD COLUMN     "totalDiscount" INTEGER,
ADD COLUMN     "totalPrice" INTEGER;
