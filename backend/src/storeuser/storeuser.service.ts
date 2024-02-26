import { Injectable } from '@nestjs/common';
import { StoreUser } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class StoreuserService {
    constructor(private prisma:PrismaService){}

    async createStoreUser(storeUser: StoreUser) : Promise<StoreUser> {
        return await this.prisma.storeUser.create({
            data:storeUser
        })
    }

    async findById(id: number): Promise<StoreUser | null> {
        return await this.prisma.storeUser.findUnique({
            where: { id },
        });
    }

    async update(id: number, storeUser: StoreUser): Promise<StoreUser | null> {
        return await this.prisma.storeUser.update({
            where: { id },
            data: storeUser,
        });
    }

    async delete(id: number): Promise<StoreUser | null> {
        return await this.prisma.storeUser.delete({
            where: { id },
        });
    }

}
