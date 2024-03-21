import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AnswerDto } from './dto/answer.dto';
import { User } from '@prisma/client';

@Injectable()
export class AnswerService {
  constructor(private prisma: PrismaService) {}

  async replyToQuestion(data: AnswerDto, user: User, question_id: number) {
    const { content, imgUrl } = data;

    await this.prisma.question.update({
      where: { id: question_id },
      data: { isAnswered: true },
    });

    if (imgUrl.length > 0) {
      const answer = await this.prisma.answer.create({
        data: {
          content,
          imgUrl,
          question: { connect: { id: question_id } },
          user: { connect: { id: user.id } },
        },
        include: { question: { include: { user: true } } },
      });
      return answer;
    } else {
      const answer = await this.prisma.answer.create({
        data: {
          content,
          question: { connect: { id: question_id } },
          user: { connect: { id: user.id } },
        },
      });
      return answer;
    }
  }

  async replyUpdateQuestion(data: AnswerDto, answer_id: number) {
    const { content, imgUrl } = data;
    const found = await this.prisma.answer.findUnique({
      where: { id: answer_id },
    });

    if (!found) {
      return;
    }

    const answer = await this.prisma.answer.update({
      where: { id: answer_id },
      data: { content, imgUrl },
    });

    return answer;
  }
}
