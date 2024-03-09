import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async updatelikeProduct(user: User, data: Object) {
    const products_states = { ...data };
    const checking = Object.keys(products_states).filter(
      (val) => products_states[val] === true,
    );

    if (!checking) return;

    const found = await this.prisma.wishList.findUnique({
      where: { userId: user.id },
    });

    if (!found) {
      await this.prisma.wishList.create({
        data: { userId: user.id },
      });
    }

    for (const [productId, liked] of Object.entries(products_states)) {
      const id = parseInt(productId);
      const found = await this.prisma.userProduct.findFirst({
        where: { productId: id, userId: user.id },
      });

      if (liked) {
        if (!found) {
          let userproduct = await this.prisma.userProduct.create({
            data: {
              userId: user.id,
              productId: id,
            },
          });
          await this.prisma.wishList.update({
            where: { userId: user.id },
            data: { products: { connect: { id } } },
          });
        }
      } else {
        if (!found) {
          continue;
        }
        await this.prisma.userProduct.delete({
          where: {
            userId_productId: {
              productId: id,
              userId: user.id,
            },
          },
        });
        await this.prisma.wishList.update({
          where: { userId: user.id },
          data: { products: { disconnect: { id } } },
        });
      }
    }

    const result = await this.prisma.wishList.findUnique({
      where: { userId: user.id },
      include: { products: { select: { id: true, likedBy: true } } },
    });

    return result;
  }

  async howManyLikes(user: User, data: Object) {
    // await this.prisma.wishList.update({
    //   where: { userId: user.id },
    //   data: { products: { connect: { id: productId } } },
    // });
    // const user_product = await this.prisma.userProduct.findUnique({
    //   where: { userId_productId: { productId, userId: user.id } },
    // });
  }
}
