import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [EventsGateway,JwtService,PrismaService,UserService]
})
export class EventsModule {}
