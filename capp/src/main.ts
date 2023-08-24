import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const secret = configService.get<string>('SESSION_SECRET');
  app.use(
    session({
      secret: secret,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Dto에 정의 안된 요소 다 지움
    }),
  );
  await app.listen(3000);
}
bootstrap();
