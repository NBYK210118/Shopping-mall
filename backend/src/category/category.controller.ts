import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category, Product } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('/:name')
  async getAllProducts(@Param('name') category: string): Promise<Product[]> {
    const result = await this.categoryService.getAllProducts(category);
    return result;
  }

  @Get('')
  async getAllCategory(): Promise<Category[]> {
    return this.categoryService.getAllCategory();
  }
}
