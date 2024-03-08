import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { Product, User, ViewedProduct } from '@prisma/client';
import { GetUser } from 'src/user/get-user.decorator';
import { Request, Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard())
  @Get(':id')
  async getProduct(@Param('id') id: number): Promise<Product> {
    return this.productService.getProduct(id);
  }

  @UseGuards(AuthGuard())
  @Get('/my-store/:category')
  async getCategoryItems(
    @GetUser() user: User,
    @Param('category') category: string,
  ) {
    return this.productService.getCategoryItems(user, category);
  }

  @UseGuards(AuthGuard())
  @Get('/is-users/:productId')
  async isUsersProduct(@GetUser() user:User, @Param('productId' , ParseIntPipe) productId:number):Promise<Boolean>{
    return this.productService.isUsersProduct(user,productId)
  }

  @Post('/guest/viewed')
  async guestWatchedProduct(@Body('productId', ParseIntPipe) productId:number) : Promise<void>  {
    return this.productService.guestWatchedProduct(productId)
  }

  @Post('/user/viewed')
  @UseGuards(AuthGuard())
  async userWatchedProduct(@GetUser() user:User, @Body('productId',ParseIntPipe) productId:number) : Promise<ViewedProduct> {
    return this.productService.userWatchedProduct(user,productId);
  }
}
