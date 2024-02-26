import { Injectable } from '@nestjs/common';
import { Store } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class StoreService {
    constructor(private prisma:PrismaService){}

    async createStore(data:Store) : Promise<Store> {
        const result = await this.prisma.store.create({data});

        return result
    }

    async updateStore(id:number, data:Store) : Promise<Store> {
        const result = await this.prisma.store.update({
            where:{id},
            data
        })

        return result
    }

    async getStore(id:number) : Promise<Store> {
        const result = await this.prisma.store.findUnique({where:{id}})
        return result
    }

    async getStores() : Promise<Store[]> {
        const result = await this.prisma.store.findMany({})
        return result
    }

    async deleteStore(id:number) : Promise<Store> {
        const result = await this.prisma.store.delete({where:{id}});
        return result
    }
}
