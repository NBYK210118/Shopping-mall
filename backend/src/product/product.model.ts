import { $Enums, Prisma } from '@prisma/client';

export class Product implements Prisma.ProductCreateInput {
  name: string;
  price: number;
  description: string;
  manufacturer: string;
  category: Prisma.CategoryCreateNestedOneWithoutProductsInput;
  category_name: string;
  status?: string;
  SellingList?: Prisma.SellingListCreateNestedOneWithoutProductsInput;
  WishList?: Prisma.WishListCreateNestedOneWithoutProductsInput;
  inventory: number;
  images?: Prisma.ImageCreateNestedManyWithoutProductsInput;
  ProductImage?: Prisma.ProductImageCreateNestedManyWithoutProductInput;
  store?: Prisma.StoreCreateNestedOneWithoutSelling_listInput;
  user?: Prisma.UserCreateNestedOneWithoutWishlistInput;
  orders?: Prisma.OrderCreateNestedManyWithoutProductsInput;
  OrderProduct?: Prisma.OrderProductCreateNestedManyWithoutProductInput;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export class SellingList implements Prisma.SellingListCreateInput {
  products?: Prisma.ProductCreateNestedManyWithoutSellingListInput;
  store?: Prisma.StoreCreateNestedOneWithoutSelling_listInput;
  user?: Prisma.UserCreateNestedOneWithoutSellinglistInput;
}

export class WishList implements Prisma.WishListCreateInput {
  products?: Prisma.ProductCreateNestedManyWithoutWishListInput;
  user: Prisma.UserCreateNestedOneWithoutWishlistInput;
}

export class Category implements Prisma.CategoryCreateInput {
  name: string;
  products?: Prisma.ProductCreateNestedManyWithoutCategoryInput;
}
