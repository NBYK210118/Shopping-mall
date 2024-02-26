import { Prisma } from "@prisma/client";

export class OrderProduct implements Prisma.OrderProductCreateInput{
    order: Prisma.OrderCreateNestedOneWithoutOrderProductInput;
    product: Prisma.ProductCreateNestedOneWithoutOrderProductInput;
}