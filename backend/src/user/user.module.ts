import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/database/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from 'src/database/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer-config.service';
import { StoreuserService } from 'src/storeuser/storeuser.service';

@Module({
  imports:[
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'Secret1234',
      signOptions:{
        expiresIn: 60 * 60
      }
    }),
    PrismaModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService
    }),
  ],
  controllers: [UserController],
  providers: [UserService, StoreuserService,PrismaService, JwtStrategy],
  exports:[JwtStrategy,PassportModule]
})
export class UserModule {}
