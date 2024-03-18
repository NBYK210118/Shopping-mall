-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "shoppingbasketId" INTEGER;

-- CreateTable
CREATE TABLE "ShoppingBasket" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ShoppingBasket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingBasket_userId_key" ON "ShoppingBasket"("userId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_shoppingbasketId_fkey" FOREIGN KEY ("shoppingbasketId") REFERENCES "ShoppingBasket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingBasket" ADD CONSTRAINT "ShoppingBasket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
