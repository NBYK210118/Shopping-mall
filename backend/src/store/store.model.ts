import { Prisma } from '@prisma/client';

export class Store implements Prisma.StoreCreateInput {
  name: string;
  orders?: Prisma.OrderCreateNestedManyWithoutStoreInput;
  selling_list?: Prisma.SellingListCreateNestedOneWithoutStoreInput;
  sellingListId?: number;
  users?: Prisma.UserCreateNestedManyWithoutStoreInput;
}
