import { $Enums, Prisma } from '@prisma/client';

export class Product implements Prisma.ProductCreateInput {
  name: string;
  price: number;
  description: string;
  manufacturer: string;
  category: Prisma.CategoryCreateNestedOneWithoutProductsInput;
  category_name: string;
  likedBy?: Prisma.UserCreateNestedManyWithoutProductInput;
  reviews?: Prisma.ReviewCreateNestedManyWithoutProductInput;
  status?: string;
  SellingList?: Prisma.SellingListCreateNestedOneWithoutProductsInput;
  WishList?: Prisma.WishListCreateNestedOneWithoutProductsInput;
  viewedProduct?: Prisma.ViewedProductCreateNestedOneWithoutProductsInput;
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

export class ProductUpdateInput implements Prisma.ProductUpdateInput {
  OrderProduct?: Prisma.OrderProductUpdateManyWithoutProductNestedInput;
  ProductImage?: Prisma.ProductImageUpdateManyWithoutProductNestedInput;
  SellingList?: Prisma.SellingListUpdateOneWithoutProductsNestedInput;
  WishList?: Prisma.WishListUpdateOneWithoutProductsNestedInput;
  category?: Prisma.CategoryUpdateOneRequiredWithoutProductsNestedInput;
  category_name?: string | Prisma.StringFieldUpdateOperationsInput;
  createdAt?: string | Date | Prisma.DateTimeFieldUpdateOperationsInput;
  description?: string | Prisma.StringFieldUpdateOperationsInput;
  images?: Prisma.ImageUpdateManyWithoutProductsNestedInput;
  inventory?: number | Prisma.IntFieldUpdateOperationsInput;
  manufacturer?: string | Prisma.StringFieldUpdateOperationsInput;
  name?: string | Prisma.StringFieldUpdateOperationsInput;
  orders?: Prisma.OrderUpdateManyWithoutProductsNestedInput;
  price?: number | Prisma.IntFieldUpdateOperationsInput;
  reviews?: Prisma.ReviewUpdateManyWithoutProductNestedInput;
  status?: string | Prisma.NullableStringFieldUpdateOperationsInput;
  updatedAt?: string | Date | Prisma.DateTimeFieldUpdateOperationsInput;
  viewedProduct?: Prisma.ViewedProductUpdateOneWithoutProductsNestedInput;
  likedBy?: Prisma.UserUpdateManyWithoutProductNestedInput;
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
