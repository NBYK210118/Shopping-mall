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
  async adminAnswered(data: AnswerDto) {
    const { content, imgUrl, img_size, question_id } = data;

    // 질문 찾고 답변 질문 레코드에 저장해주기 -> isAnswered 업데이트, answer 업데이트 -> 답변을 저장해주려는 질문이 없을 시 에러 발생시켜주기
    await this.prisma.question.findUnique({
      where: { id: Number(question_id) },
    });
  }
}
