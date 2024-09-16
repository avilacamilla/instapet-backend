import { Timestamp } from "firebase-admin/firestore";

export interface CardModel {
    cardId: string;
    userId?: string;
    createdAt: Timestamp;
    imageUrl: string;
    title: string;
    description: string;
}