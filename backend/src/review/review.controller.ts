import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto/review.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/user/get-user.decorator';
import { Response } from 'express';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get('/all')
  async getAllReviewsByProduct(@Query('product_id') product_id: string) {
    return this.reviewService.getAllReviewsByProduct(+product_id);
  }

  @UseGuards(AuthGuard())
  @Post('/update')
  async reviewUpdate(@GetUser() user: User, @Body() data: ReviewDto) {
    const result = await this.reviewService.reviewUpdate(user, data);
    return result;
  }
}
