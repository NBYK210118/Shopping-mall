import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category, Product } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('category')
export class CategoryController {
    constructor(private categoryService:CategoryService){}

    @UseGuards(AuthGuard())
    @Get(':category')
    async getAllProducts(
    @Param('category') category: string,
  ): Promise<Product[]> {
    return this.categoryService.getAllProducts(category);
  } 

    @Get('')
    async getAllCategory() : Promise<Category[]>{
        return this.categoryService.getAllCategory()
    }
}
