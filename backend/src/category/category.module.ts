import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { PrismaService } from 'src/database/prisma.service';
import { ProductService } from 'src/product/product.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/user/jwt.strategy';

@Module({
  imports:[PassportModule.register({defaultStrategy:"jwt"})],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, ProductService, JwtStrategy]
})
export class CategoryModule {}
