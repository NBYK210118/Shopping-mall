import { Injectable } from '@nestjs/common';
import { Product, User, ViewedProduct } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: Product): Promise<Product> {
    const result = await this.prisma.product.create({ data });

    return result;
  }

  async updateProduct(id: number, data: Product): Promise<Product> {
    const result = await this.prisma.product.update({
      where: { id },
      data,
    });

    return result;
  }

  async getProduct(id: number): Promise<Product> {
    const result = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, reviews: true, likedBy: true },
    });
    return result;
  }

  async getProducts(): Promise<Product[]> {
    const result = await this.prisma.product.findMany({});
    return result;
  }

  async getCategoryItems(
    user: User,
    category: string,
  ): Promise<Product | Product[]> {
    const result = await this.prisma.product.findMany({
      where: {
        sellingListId: user.sellinglistId,
        AND: { category_name: category },
      },
      include: { images: true },
    });
    return result;
  }

  async getAllProducts(category: string): Promise<Product[]> {
    const result = await this.prisma.product.findMany({
      where: { category_name: category },
      include: { images: true, likedBy: true },
    });

    return result;
  }

  async getProductByName(keyword: string): Promise<Product | Product[]> {
    const found = await this.prisma.product.findMany({
      where: { name: { contains: keyword } },
      include: { images: true },
    });

    if (!found) {
      return [];
    }

    return found;
  }

  // 현재 상품 상세 정보 페이지에 올라와있는 상품이 현재 사용자가 올렸던 상품인지
  async isUsersProduct(user: User, productId: number): Promise<Boolean> {
    const found = await this.prisma.sellingList.findFirst({
      where: { userId: user.id, products: { some: { id: productId } } },
    });

    if (!found) return false;

    return true;
  }

  async guestWatchedProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    await this.prisma.product.update({
      where: { id: productId },
      data: { viewed_count: product.viewed_count + 1 },
    });
  }

  async userWatchedProduct(
    user: User,
    productId: number,
  ): Promise<ViewedProduct[]> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    const viewed_product = await this.prisma.viewedProduct.findUnique({
      where: { userId: user.id },
    });

    if (!product) {
      throw new Error('상품이 존재하지 않습니다');
    }

    if (!viewed_product) {
      await this.prisma.viewedProduct.create({
        data: { userId: user.id },
      });
    }

    await this.prisma.product.update({
      where: { id: product.id },
      data: { viewed_count: product.viewed_count + 1 },
    });

    await this.prisma.viewedProduct.update({
      where: { userId: user.id },
      data: { products: { connect: { id: productId } } },
    });

    const viewedproduct = await this.prisma.viewedProduct.findMany({
      where: { userId: user.id },
    });

    return viewedproduct;
  }

  async deleteProduct(id: number): Promise<Product> {
    const result = await this.prisma.product.delete({ where: { id } });
    return result;
  }

  async getDiscountingProducts(): Promise<Product[]> {
    const discounting_products = await this.prisma.product.findMany({
      where: { isDiscounting: { equals: true } },
      take: 4,
      include: { images: true },
    });

    return discounting_products;
  }

  async getProductsByPage(
    user: User,
    page: number,
    limit: number,
  ): Promise<Product[]> {
    const skip = (page - 1) * limit;

    const products = await this.prisma.product.findMany({
      take: limit,
      skip,
      orderBy: {
        id: 'asc',
      },
    });

    return products;
  }
}
