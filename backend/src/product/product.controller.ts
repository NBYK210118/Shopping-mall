import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { Product, User } from '@prisma/client';
import { GetUser } from 'src/user/get-user.decorator';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard())
  @Get('/:category')
  async getCategoryItems(
    @GetUser() user: User,
    @Param('category') category: string,
  ) {
    return this.productService.getCategoryItems(user, category);
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  async getProduct(@Param('id') id: number): Promise<Product> {
    return this.productService.getProduct(id);
  }
}
