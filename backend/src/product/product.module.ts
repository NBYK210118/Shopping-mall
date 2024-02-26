import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtStrategy } from 'src/user/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[PassportModule.register({defaultStrategy: 'jwt'})],
  controllers: [ProductController],
  providers: [ProductService,PrismaService,JwtStrategy],
})
export class ProductModule {}
