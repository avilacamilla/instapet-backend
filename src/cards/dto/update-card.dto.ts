//informação que eu preciso transferir entre funções - data transfer object
export interface UpdateCardDto {
    cardId: string;
    title?: string;
    description?: string;
}