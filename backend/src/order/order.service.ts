import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class OrderService {
    constructor(private prisma:PrismaService){}

    async createOrder(data:Order) : Promise<Order> {
        const result = await this.prisma.order.create({data});

        return result
    }

    async updateOrder(id:number, data:Order) : Promise<Order> {
        const result = await this.prisma.order.update({
            where:{id},
            data
        })

        return result
    }

    async getOrder(id:number) : Promise<Order> {
        const result = await this.prisma.order.findUnique({where:{id}})
        return result
    }

    async getOrders() : Promise<Order[]> {
        const result = await this.prisma.order.findMany({})
        return result
    }

    async deleteOrder(id:number) : Promise<Order> {
        const result = await this.prisma.order.delete({where:{id}});
        return result
    }
}
