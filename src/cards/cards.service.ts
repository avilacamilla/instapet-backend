import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import FirebaseFirestore from '@google-cloud/firestore';
import { CreateCardDto } from './dto/create-card.dto';
import { Auth } from 'firebase-admin/auth';
import * as uuid from 'uuid';
import { Timestamp } from 'firebase-admin/firestore';
import { CardModel } from 'src/models/card.model';
import { DeleteCardDto } from './dto/delete-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
    private logger = new Logger(CardsService.name);
    @Inject('FIRESTORE') private firestore: FirebaseFirestore.Firestore;
    @Inject('AUTH') private auth: Auth;

    public async createCard(dto: CreateCardDto, token?: string) {
        this.logger.log('Criando card');
        //Aguardando autenticação,
        const user = await this.checkUser(token);
        
        try {
            const userId = user.email;
            const cardId = uuid.v7();
            const now = new Date();
            const createdAt = Timestamp.fromDate(now);

            const card: CardModel = {
                cardId: cardId,
                createdAt: createdAt,
                imageUrl: dto.imageUrl,
                title: dto.title,
                description: dto.description,
                userId: userId
            }

            this.logger.warn(`Enviando ${cardId} para Firestore`)
            await this.firestore
                .collection('cards')
                .doc(cardId)
                .set(card)
            
            return card;

        } catch(error) {
            this.logger.error(`Não foi possível criar card ${error}`)
            throw new HttpException('Não foi possível criar cards', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //getcard
    public async getCards(token?: string) {
        this.logger.log('Resgatando cards');
        //Aguardando autenticação
        await this.checkUser(token);
        try {
            const cards = await this.firestore
                .collection('cards')
                .orderBy('createdAt', 'desc')
                .get();

            const cardsData = cards.docs.map(card => card.data());

            return { cards: cardsData }
        } catch(error) {
            this.logger.error(error);
            throw new HttpException('Não foi possível resgatar cards', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    //deletecard
    public async deleteCard(dto: DeleteCardDto, token?: string) {
        this.logger.log(`Deletando card ${dto.cardId}`)
        //Aguardando autenticação
        const user = await this.checkUser(token);
        try {
            const card = await this.firestore
                .collection('cards')
                .where('cardId','==',dto.cardId)
                .where('userId','==',user.email)
                .get();
        
                if(card.empty){
                    const errorMessage = `Não foi possível encontrar card ${dto.cardId}`;
                    throw new HttpException(errorMessage,HttpStatus.NOT_FOUND);
                }
        
                await this.firestore
                    .collection('cards')
                    .doc(dto.cardId)
                    .delete();

        } catch(error) {
            if(error.status === HttpStatus.NOT_FOUND) {
                throw error;
            }
            this.logger.error(error);
            throw new HttpException('Não foi possível deletar cards', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //updatecard
    public async updateCard(dto: UpdateCardDto, token?: string) {
        this.logger.log(`Atualizando card ${dto.cardId}`)

        //Aguardando autenticação
        const user = await this.checkUser(token);

        if(!dto.cardId) {
            const errorMessage = `CardId não fornecido`;
            throw new HttpException(errorMessage,HttpStatus.BAD_REQUEST);
        } else if(!dto.title && !dto.description) {
            const errorMessage = `Title ou Description requeridos`;
            throw new HttpException(errorMessage,HttpStatus.BAD_REQUEST);
        }

        try {
            const cards = await this.firestore
                .collection('cards')
                .where('cardId','==',dto.cardId)
                .where('userId','==',user.email)
                .get();
        
                if(cards.empty){
                    const errorMessage = `Não foi possível encontrar card ${dto.cardId}`;
                    throw new HttpException(errorMessage,HttpStatus.NOT_FOUND);
                }

                await this.firestore
                    .collection('cards')
                    .doc(dto.cardId)
                    .update({
                        title: dto.title,
                        description: dto.description
                    });

                const cardsUpdateds = await this.firestore
                    .collection('cards')
                    .where('cardId','==',dto.cardId)
                    .where('userId','==',user.email)
                    .get();

                const card = cardsUpdateds.docs[0].data();

                return card;

        } catch(error) {
            if(error.status === HttpStatus.NOT_FOUND) {
                throw error;
            }
            this.logger.error(error);
            throw new HttpException('Não foi possível deletar cards', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    

    private async checkUser(token?: string) {
        //   Aguardando autenticação
        if (!token) {
            throw new HttpException('Usuário não especificado!', HttpStatus.BAD_REQUEST);
        }

        try {
            const tokenId = token.split(' ')[1];
            const user = await this.auth.verifyIdToken(tokenId);

            return user;
        } catch(error) {
            this.logger.error(error);
            throw new HttpException('Não foi possível autenticar o usuário', HttpStatus.FORBIDDEN)
        }       
    }
}
