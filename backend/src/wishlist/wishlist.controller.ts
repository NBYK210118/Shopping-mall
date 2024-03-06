import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Product, WishList } from '@prisma/client';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @UseGuards(AuthGuard())
  @Get(':userId')
  async getLikedProducts(@Param('userId') userId: number) {
    const result = await this.wishlistService.getLikedProducts(Number(userId));
    return result;
  }
}
