import { Module } from '@nestjs/common';
import { ViewedproductController } from './viewedproduct.controller';
import { ViewedproductService } from './viewedproduct.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtStrategy } from 'src/user/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ViewedproductController],
  providers: [ViewedproductService, PrismaService, JwtStrategy],
})
export class ViewedproductModule {}
