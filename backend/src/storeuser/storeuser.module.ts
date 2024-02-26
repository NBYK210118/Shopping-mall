import { Module } from '@nestjs/common';
import { StoreuserController } from './storeuser.controller';
import { StoreuserService } from './storeuser.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [StoreuserController],
  providers: [StoreuserService,PrismaService],
})
export class StoreuserModule {}
