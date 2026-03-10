import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Autorise le front-end Vue.js à communiquer avec l'API
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
