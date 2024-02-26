import { Prisma } from "@prisma/client";

export class ProductImage implements Prisma.ProductImageCreateInput {
    image: Prisma.ImageCreateNestedOneWithoutProductImageInput;
    product: Prisma.ProductCreateNestedOneWithoutProductImageInput;
}