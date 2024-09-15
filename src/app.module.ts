import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

//unidade de configuração
@Module({
  imports: [CardsModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, ConfigService], //injeção de dependencias
})
export class AppModule {}
