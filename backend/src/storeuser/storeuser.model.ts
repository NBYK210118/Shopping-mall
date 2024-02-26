import { $Enums, Prisma } from "@prisma/client";

export class StoreUser implements Prisma.StoreUserCreateInput{
    role: $Enums.StoreRoles;
    store: Prisma.StoreCreateNestedOneWithoutUsersInput;
    user: Prisma.UserCreateNestedOneWithoutStoreUserInput;
}