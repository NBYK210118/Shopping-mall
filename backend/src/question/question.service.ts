import { Injectable } from '@nestjs/common';
import { Question, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { QuestionDto } from './dto/question.dto';
import { AnswerDto } from './dto/answer.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async getQuestions(): Promise<Question[]> {
    const result = await this.prisma.question.findMany({
      include: { user: { include: { profile: true } }, answer: true },
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
    const { content, imgUrl } = data;

    const result = await this.prisma.question.create({
      data: { content, imgUrl, user: { connect: { id: user.id } } },
      include: { answer: true },
    });

    return result;
  }

  async updateQuestion(
    user: User,
    data: QuestionDto,
    question_id: number,
  ): Promise<Question> {
    const { content, imgUrl } = data;
    const question = await this.prisma.question.findUnique({
      where: { id: question_id, userId: user.id },
    });

    if (!question) {
      throw new Error('Question Not found Error');
    }

    const result = await this.prisma.question.update({
      where: { id: question_id, userId: user.id },
      data: { content, imgUrl },
      include: { answer: true },
    });

    return result;
  }
}
