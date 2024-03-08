import { Prisma } from '@prisma/client';

export class Review implements Prisma.ReviewCreateInput {
  txt: string;
  stars?: number;
  product: Prisma.ProductCreateNestedOneWithoutReviewsInput;
  user: Prisma.UserCreateNestedOneWithoutReviewsInput;
  reviewProduct?: Prisma.ReviewProductCreateNestedManyWithoutReviewInput;
}
