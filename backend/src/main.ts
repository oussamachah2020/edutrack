import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const port = 3000;
  console.log(port);
  await app.listen(port);
  Logger.log(`🚀 App running on http://localhost:${port}`);
}
bootstrap();
