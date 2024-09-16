import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { AuthProvider, FirestoreProvider } from 'src/commons/firebase.provider';

@Module({
  controllers: [CardsController],
  providers: [CardsService, FirestoreProvider, AuthProvider],
})
export class CardsModule {}
