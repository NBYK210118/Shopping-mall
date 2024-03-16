import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SellinglistService } from './sellinglist.service';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';

@Controller('sellinglist')
export class SellinglistController {
  constructor(private sellinglist: SellinglistService) {}

  @UseGuards(AuthGuard())
  @Get('/')
  async getSellinglist(@GetUser() user: User, @Query('limit') limit: string) {
    return this.sellinglist.getSellinglist(user, +limit);
  }
}
