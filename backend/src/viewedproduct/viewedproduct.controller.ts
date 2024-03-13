import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ViewedproductService } from './viewedproduct.service';
import { Product, User } from '@prisma/client';
import { GetUser } from 'src/user/get-user.decorator';

@Controller('viewedproduct')
export class ViewedproductController {
  constructor(private viewedproductService: ViewedproductService) {}

  @UseGuards(AuthGuard())
  @Get('/recent-watched')
  async recentUserWatched(@GetUser() user: User): Promise<Product[]> {
    return this.viewedproductService.recentUserWatched(user);
  }

  @Get('/recent-watched/every-products')
  async mostViewdProducts(): Promise<Product[]> {
    return this.viewedproductService.mostViewedProducts();
  }
}
