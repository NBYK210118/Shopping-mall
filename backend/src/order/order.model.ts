import { $Enums, Prisma } from "@prisma/client";

export class Order implements Prisma.OrderCreateInput{
    type: $Enums.OrderType;
    products?: Prisma.ProductCreateNestedManyWithoutOrdersInput;
    store: Prisma.StoreCreateNestedOneWithoutOrdersInput;
    user?: Prisma.UserCreateNestedOneWithoutOrdersInput;
    OrderProduct?: Prisma.OrderProductCreateNestedManyWithoutOrderInput;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}