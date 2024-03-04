import { Prisma } from "@prisma/client";

export class Category implements Prisma.CategoryCreateInput{
    name: string;
    products?: Prisma.ProductCreateNestedManyWithoutCategoryInput;
}