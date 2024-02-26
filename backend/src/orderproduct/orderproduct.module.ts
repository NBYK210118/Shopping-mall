import { Module } from '@nestjs/common';
import { OrderproductController } from './orderproduct.controller';
import { OrderproductService } from './orderproduct.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [OrderproductController],
  providers: [OrderproductService,PrismaService],
})
export class OrderproductModule {}
