import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private prismaService:PrismaService){}

    async getAllCategory() : Promise<Category[]>{
        const result = await this.prismaService.category.findMany()

        return result
    }
}
