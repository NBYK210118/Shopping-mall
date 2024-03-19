import { Injectable } from '@nestjs/common';
import { Product, WishList } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prismaService: PrismaService) {}

  async getLikedProducts(userId: number): Promise<WishList> {
    const result = await this.prismaService.wishList.findUnique({
      where: { userId },
      include: {
        products: {
          include: { images: true, likedBy: true },
        },
      },
    });
    return result;
  }
}
