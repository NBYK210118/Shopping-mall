import { Injectable } from '@nestjs/common';
import { Image } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ImageService {
    constructor(private prisma:PrismaService){}

    async createImage(data:Image) : Promise<Image> {
        const result = await this.prisma.image.create({data});

        return result
    }

    async updateImage(id:number, data:Image) : Promise<Image> {
        const result = await this.prisma.image.update({
            where:{id},
            data
        })

        return result
    }

    async getImage(id:number) : Promise<Image> {
        const result = await this.prisma.image.findUnique({where:{id}})
        return result
    }

    async getImages() : Promise<Image[]> {
        const result = await this.prisma.image.findMany({})
        return result
    }

    async deleteImage(id:number) : Promise<Image> {
        const result = await this.prisma.image.delete({where:{id}});
        return result
    }
}
