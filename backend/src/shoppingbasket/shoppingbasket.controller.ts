import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ShoppingbasketService } from './shoppingbasket.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';

@Controller('shoppingbasket')
export class ShoppingbasketController {
  constructor(private basketService: ShoppingbasketService) {}

  @Get('')
  @UseGuards(AuthGuard())
  async getMyBasket(@GetUser() user: User) {
    return this.basketService.getMyBasket(user);
  }

  @Post('/add')
  @UseGuards(AuthGuard())
  async addProduct(
    @GetUser() user: User,
    @Query('product_id') productId: string,
  ) {
    return this.basketService.addProduct(user, +productId);
  }

  @Post('/remove')
  @UseGuards(AuthGuard())
  async removeProduct(
    @GetUser() user: User,
    @Query('product_id') productId: string,
  ) {
    return this.basketService.removeProduct(user, +productId);
  }
}
