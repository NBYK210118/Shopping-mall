import {
  Body,
  Controller,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';

@Controller('like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @UseGuards(AuthGuard())
  @Post('/islikeit')
  async updatelikeProduct(@GetUser() user: User, @Body('likes') data: string) {
    const parsedData = JSON.parse(data);
    const result = await this.likeService.updatelikeProduct(user, parsedData);
    return result;
  }

  @UseGuards(AuthGuard())
  @Post('/product')
  async howManyLikes(@GetUser() user: User, @Body('like_state') like_state) {
    const parsedData = JSON.parse(like_state);
    return this.likeService.howManyLikes(user, parsedData);
  }
}
