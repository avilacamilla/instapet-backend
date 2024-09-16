import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  public createCard(@Body() dto: CreateCardDto, @Headers('authorization') token?: string) {
    
    return this.cardsService.createCard(dto, token);
  }

  @Get()
  public getCards(@Headers('authorization') token?: string) {
    
    return this.cardsService.getCards(token);
  }

  @Delete("/:cardId")  
  @HttpCode(204)
  public async deleteCard(@Param("cardId") cardId: string, @Headers('authorization') token?: string){
    await this.cardsService.deleteCard({ cardId: cardId }, token);        
  }

  @Patch("/:cardId")
  public updateCard(@Body() dto: UpdateCardDto, @Param("cardId") cardId: string, @Headers('authorization') token?: string) {

    dto.cardId = cardId;

    return this.cardsService.updateCard(dto, token);
  } 
}
