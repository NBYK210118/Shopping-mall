import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { QuestionService } from './question.service';
import { AuthGuard } from '@nestjs/passport';
import { QuestionDto } from './dto/question.dto';
import { GetUser } from 'src/user/get-user.decorator';
import { Question, User } from '@prisma/client';
import { AnswerDto } from './dto/answer.dto';

@Controller('question')
export class QuestionController {
  constructor(private question: QuestionService) {}

  @Get('')
  async getQuestions(): Promise<Question[]> {
    return this.question.getQuestions();
  }

  @Get('/user')
  @UseGuards(AuthGuard())
  async getUserQuestions(@GetUser() user: User): Promise<Question[]> {
    return this.question.getUserQuestions(user);
  }

  @UseGuards(AuthGuard())
  @Post('/add')
  async addQuestion(
    @GetUser() user: User,
    @Body() data: QuestionDto,
  ): Promise<Question> {
    console.log(data);
    return this.question.addQuestion(user, data);
  }

  @UseGuards(AuthGuard())
  @Post('/admin-answered')
  async adminAnswered(@Body() data: AnswerDto) {
    return this.question.adminAnswered(data);
  }
}
