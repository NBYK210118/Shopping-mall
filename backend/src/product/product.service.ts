import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProductService {
    constructor(private prisma:PrismaService){}

    async createProduct(data:Product) : Promise<Product> {
        const result = await this.prisma.product.create({data});

        return result
    }

    async updateProduct(id:number, data:Product) : Promise<Product> {
        const result = await this.prisma.product.update({
            where:{id},
            data
        })

        return result
    }

    async getProduct(id:number) : Promise<Product> {
        const result = await this.prisma.product.findUnique({
            where:{id:Number(id)},
            include:{images:true}
        })
        return result
    }

    async getProducts() : Promise<Product[]> {
        const result = await this.prisma.product.findMany({})
        return result
    }

    async deleteProduct(id:number) : Promise<Product> {
        const result = await this.prisma.product.delete({where:{id}});
        return result
    }
}
