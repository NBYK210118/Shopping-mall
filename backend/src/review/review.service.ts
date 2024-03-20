import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ReviewDto } from './dto/review.dto';
import { Review, User } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  // 특정 상품에 대한 리뷰 모두 불러오기
  async getAllReviewsByProduct(product_id: number): Promise<Review[]> {
    const result = await this.prisma.review.findMany({
      where: { productId: product_id },
      include: { user: { include: { profile: true } } },
    });
    return result;
  }

  // 상품 상세정보 페이지에서 사용자가 작성한 리뷰 업데이트
  async reviewUpdate(user: User, data: ReviewDto): Promise<Review> {
    const { productId, review, stars } = data;

    const found = await this.prisma.review.findFirst({
      where: { userId: user.id, productId: Number(productId) },
    });

    if (!found) {
      // 리뷰 생성 -> 유저와 Product와 connect 시켜주고
      const created_review = await this.prisma.review.create({
        data: {
          txt: review,
          stars: Number(stars),
          user: { connect: { id: user.id } },
          product: { connect: { id: Number(productId) } },
        },
      });
      // ReviewProduct 에 reviewId와 productId 연결시켜줌
      await this.prisma.reviewProduct.create({
        data: { productId: Number(productId), reviewId: created_review.id },
      });
    } else {
      // 작성되어있던 리뷰 데이터 찾아주고
      const find_review = await this.prisma.review.findFirst({
        where: { userId: user.id, productId: Number(productId) },
      });
      // 리뷰 내용 업데이트
      await this.prisma.review.update({
        where: { id: find_review.id },
        data: { stars: Number(stars), txt: review },
      });
    }
    // 결과 리턴
    const result = await this.prisma.review.findFirst({
      where: { productId: Number(productId), userId: user.id },
    });

    console.log('review result: ', result);

    return result;
  }
}
