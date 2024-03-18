import { Injectable } from '@nestjs/common';
import { ShoppingBasket, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ShoppingbasketService {
  constructor(private prisma: PrismaService) {}

  async getMyBasket(user: User) {
    const found = await this.prisma.shoppingBasket.findFirst({
      where: { userId: user.id },
    });

    if (!found) {
      return;
    }

    const products = await this.prisma.shoppingBasket.findMany({
      where: { userId: user.id },
      include: { product: { include: { images: true } } },
    });

    const summary = await this.prisma.basketSummary.findUnique({
      where: { userId: user.id },
    });
    const data = {
      products,
      summary,
    };
    return data;
  }

  async addProduct(user: User, productId: number) {
    const found = await this.prisma.shoppingBasket.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    const found_cartsummary = await this.prisma.basketSummary.findUnique({
      where: { userId: user.id },
    });

    const found_product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!found_product) {
      throw new Error('Failed to find product');
    }

    if (!found) {
      await this.prisma.shoppingBasket.create({
        data: {
          user: { connect: { id: user.id } },
          product: { connect: { id: productId } },
        },
      });
    }

    if (!found_cartsummary) {
      await this.prisma.basketSummary.create({
        data: { user: { connect: { id: user.id } } },
      });
    }

    await this.prisma.shoppingBasket.update({
      where: { userId_productId: { userId: user.id, productId } },
      data: { quantity: { increment: 1 } },
    });

    const effectivePrice = found_product.isDiscounting
      ? found_product.discountPrice
      : found_product.price;
    const discountAmount = found_product.isDiscounting
      ? found_product.price - found_product.discountPrice
      : 0;

    await this.prisma.basketSummary.update({
      where: { userId: user.id },
      data: {
        totalPrice: { increment: found_product.price },
        totalDiscount: { increment: discountAmount },
        finalPay: { increment: effectivePrice },
      },
    });

    const products = await this.prisma.shoppingBasket.findMany({
      where: { userId: user.id },
      include: { product: { include: { images: true } } },
    });

    const summary = await this.prisma.basketSummary.findUnique({
      where: { userId: user.id },
    });

    const data = { products, summary };

    return data;
  }

  async removeProduct(user: User, productId: number) {
    const found = await this.prisma.shoppingBasket.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    const found_cartsummary = await this.prisma.basketSummary.findUnique({
      where: { userId: user.id },
    });

    const found_product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!found_product) {
      throw new Error('존재하지 않는 상품입니다');
    }

    if (!found) {
      return '이미 제거되었거나 장바구니에 없는 상품입니다';
    }

    if (!found_cartsummary) {
      await this.prisma.basketSummary.create({
        data: { user: { connect: { id: user.id } } },
      });
    }

    const effectivePrice = found_product.isDiscounting
      ? found_product.discountPrice
      : found_product.price;
    const discountAmount = found_product.isDiscounting
      ? found_product.price - found_product.discountPrice
      : 0;

    await this.prisma.basketSummary.update({
      where: { userId: user.id },
      data: {
        totalPrice: { decrement: found_product.price },
        totalDiscount: { decrement: discountAmount },
        finalPay: { decrement: effectivePrice },
      },
    });

    const updated_basket = await this.prisma.shoppingBasket.update({
      where: { userId_productId: { userId: user.id, productId } },
      data: { quantity: { decrement: 1 } },
    });

    if (updated_basket.quantity < 1) {
      await this.prisma.shoppingBasket.delete({
        where: { userId_productId: { userId: user.id, productId } },
      });
    }

    const products = await this.prisma.shoppingBasket.findMany({
      where: { userId: user.id },
      include: { product: { include: { images: true } } },
    });

    const summary = await this.prisma.basketSummary.findUnique({
      where: { userId: user.id },
    });

    const data = {
      products,
      summary,
    };

    return data;
  }
}
