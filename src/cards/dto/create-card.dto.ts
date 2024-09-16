//informação que eu preciso transferir entre funções - data transfer object
export interface CreateCardDto {
    userId?: string; //aguardando auth
    imageUrl: string;
    title: string;
    description: string;
}