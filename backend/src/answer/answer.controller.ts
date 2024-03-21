import { Body, Controller, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerDto } from './dto/answer.dto';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('answer')
export class AnswerController {
  constructor(private answer: AnswerService) {}

  @UseGuards(AuthGuard())
  @Post('/reply')
  async replyToQuestion(
    @Body() data: AnswerDto,
    @GetUser() user: User,
    @Query('question_id') question_id: string,
  ) {
    return this.answer.replyToQuestion(data, user, +question_id);
  }

  @UseGuards(AuthGuard())
  @Put('/reply/update')
  async replyUpdateQuestion(
    @Body() data: AnswerDto,
    @Query('answer_id') answer_id: string,
  ) {
    return this.answer.replyUpdateQuestion(data, +answer_id);
  }
}
