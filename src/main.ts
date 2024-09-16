import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*'
  })
  //pegando uma instancia do config service e guardando na variavel config
  const config = app.get(ConfigService);

  await app.listen(config.get('API_PORT'), '0.0.0.0');
}
bootstrap();
