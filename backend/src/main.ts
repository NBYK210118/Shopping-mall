import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin:"http://localhost:3000"})
  app.use(json({limit:'50mb'}));
  await app.listen(3001);
}
bootstrap();
