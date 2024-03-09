import { Injectable } from '@nestjs/common';
import { Product, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ViewedproductService {
  constructor(private prisma: PrismaService) {}

  async recentUserWatched(user: User): Promise<Product[]> {
    const viewed_product = await this.prisma.viewedProduct.findMany({
      where: { userId: user.id },
      include: {
        products: {
          select: { images: true, price: true, name: true, description: true },
        },
      },
    });
    const result = [];
    viewed_product.map((val) => val.products.map((val) => result.push(val)));

    return result;
  }
}
