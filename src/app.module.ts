import { Module } from '@nestjs/common';
import { CardsModule } from './cards/cards.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

//unidade de configuração
@Module({
  imports: [CardsModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [ConfigService], //injeção de dependencias
})
export class AppModule {}
