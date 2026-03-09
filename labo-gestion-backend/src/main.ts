import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activation DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Rejette les champs non définis dans le DTO
      forbidNonWhitelisted: true, // Renvoie une erreur si des champs non autorisés sont envoyés
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
