import { Module } from '@nestjs/common';
import { ShoppingbasketController } from './shoppingbasket.controller';
import { ShoppingbasketService } from './shoppingbasket.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtStrategy } from 'src/user/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ShoppingbasketController],
  providers: [ShoppingbasketService, PrismaService, JwtStrategy],
})
export class ShoppingbasketModule {}
