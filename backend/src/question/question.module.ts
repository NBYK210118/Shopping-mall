import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtStrategy } from 'src/user/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [QuestionController],
  providers: [QuestionService, PrismaService, JwtStrategy],
})
export class QuestionModule {}
