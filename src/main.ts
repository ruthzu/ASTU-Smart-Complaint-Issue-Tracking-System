import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ComplaintModule } from './complaint/complaint.module';
import { DepartmentModule } from './department/department.module';
import { NotificationModule } from './notification/notification.module';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [UserModule, AuthModule, ComplaintModule, DepartmentModule, NotificationModule, OpenAIModule],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}

bootstrap();
