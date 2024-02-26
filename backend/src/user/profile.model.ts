import { Prisma } from "@prisma/client";

export class Profile implements Prisma.ProfileCreateInput{
    profile_image?: Prisma.ImageCreateNestedOneWithoutProfileInput;
    nickname: string;
    address: string;
    
    imageUrl?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;  
    user: Prisma.UserCreateNestedOneWithoutProfileInput;
}