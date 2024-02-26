import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { Product } from '@prisma/client';

@Controller('product')
export class ProductController {
    constructor(private productService:ProductService) {}

    @UseGuards(AuthGuard())
    @Get(':id')
    async getProduct(@Param('id') id:number) : Promise<Product> {
        return this.productService.getProduct(id)
    }

}
