import { Injectable } from '@nestjs/common';
import { Question, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { QuestionDto } from './dto/question.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async getQuestions(): Promise<Question[]> {
    const result = await this.prisma.question.findMany({
      include: { user: { include: { profile: true } } },
    });

    return result;
  }

  async getUserQuestions(user: User): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      where: { userId: user.id },
    });

    return questions;
  }

  async addQuestion(user: User, data: QuestionDto): Promise<Question> {
    const { content, imgUrl, img_size } = data;
    const result = await this.prisma.question.create({
      data: { content, imgUrl, user: { connect: { id: user.id } } },
    });

    return result;
  }
}
