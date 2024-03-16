import { Module } from '@nestjs/common';
import { SellinglistController } from './sellinglist.controller';
import { SellinglistService } from './sellinglist.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtStrategy } from 'src/user/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [SellinglistController],
  providers: [SellinglistService, PrismaService, JwtStrategy],
})
export class SellinglistModule {}
