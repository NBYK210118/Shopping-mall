import { Prisma } from "@prisma/client"

export class Image implements Prisma.ImageCreateInput{
    imgUrl: string;
    size: number;
    Profile?: Prisma.ProfileCreateNestedManyWithoutProfile_imageInput;
    products?: Prisma.ProductCreateNestedManyWithoutImagesInput;
    ProductImage?: Prisma.ProductImageCreateNestedManyWithoutImageInput;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}