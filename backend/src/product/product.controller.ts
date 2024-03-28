import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { Product, User, ViewedProduct } from '@prisma/client';
import { GetUser } from 'src/user/get-user.decorator';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('')
  async getProduct(@Query('product_id') product_id: string): Promise<Product> {
    if (!product_id) {
      return;
    }
    return this.productService.getProduct(+product_id);
  }

  @UseGuards(AuthGuard())
  @Get('/my-store/everypage/')
  async getProductsByPage(
    @GetUser() user: User,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.productService.getProductsByPage(user, +page, +limit);
  }

  @Get('')
  async getProductsBySearchKeyword(
    @Query('search_keyword') search_keyword: string,
  ) {
    return this.productService.getProductsBySearchKeyword(search_keyword);
  }

  @Get('/all/discounting')
  async getDiscountingProducts(): Promise<Product[]> {
    return this.productService.getDiscountingProducts();
  }

  @UseGuards(AuthGuard())
  @Get('/my-store/:category')
  async getCategoryItems(
    @GetUser() user: User,
    @Param('category') category: string,
    @Query('limit') limit: string,
  ) {
    return this.productService.getCategoryItems(user, category, +limit);
  }

  @UseGuards(AuthGuard())
  @Get('/is-users/:productId')
  async isUsersProduct(
    @GetUser() user: User,
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<Boolean> {
    return this.productService.isUsersProduct(user, productId);
  }

  @UseGuards(AuthGuard())
  @Post('/my-store/searching')
  async getProductByName(@Body('keyword') keyword: string) {
    return this.productService.getProductByName(keyword);
  }

  @Post('/guest/viewed')
  async guestWatchedProduct(
    @Body('productId', ParseIntPipe) productId: number,
  ): Promise<void> {
    return this.productService.guestWatchedProduct(productId);
  }

  @Post('/user/viewed')
  @UseGuards(AuthGuard())
  async userWatchedProduct(
    @GetUser() user: User,
    @Body('productId', ParseIntPipe) productId: number,
  ): Promise<ViewedProduct[]> {
    return this.productService.userWatchedProduct(user, productId);
  }
}
