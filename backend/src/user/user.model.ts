import { Prisma } from '@prisma/client';

export class User implements Prisma.UserCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  sellinglist?: Prisma.SellingListCreateNestedOneWithoutUserInput;
  sellinglistId: number;
  wishlistId: number;
  wishlist?: Prisma.WishListCreateNestedOneWithoutUserInput;
  orders?: Prisma.OrderCreateNestedManyWithoutUserInput;
  reviews?: Prisma.ReviewCreateNestedManyWithoutUserInput;
  profile?: Prisma.ProfileCreateNestedOneWithoutUserInput;
  store?: Prisma.StoreCreateNestedOneWithoutUsersInput;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  likedProducts?: Prisma.UserProductCreateNestedManyWithoutUserInput;
  userProduct?: Prisma.UserProductCreateNestedManyWithoutUserInput;
  viewedProducts?: Prisma.ViewedProductCreateNestedManyWithoutUserInput;
}
