import FirebaseFirestore from '@google-cloud/firestore';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, ServiceAccount, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Auth, getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

class FirebaseManager {
    private static initialized = false;

    //função que inicia o firebase
    private static configFirebase(config: ConfigService) {
    //criando uma instancia de um Logger
        const logger =  new Logger('configFirebase');
        logger.warn('Iniciando firebase');

        const firebaseAccountSerialized = readFileSync(
            config.get<string>('FIREBASE_CONFIG_PATH'),
            {
                encoding: 'utf-8',
            },
        );
        const firebaseAccount = JSON.parse(firebaseAccountSerialized) as ServiceAccount;

        initializeApp({
                credential: cert(firebaseAccount),
        });
    }

    public static initializeFirebase(config: ConfigService) {
        if (!FirebaseManager.initialized) {
            FirebaseManager.configFirebase(config);
            FirebaseManager.initialized = true;
        }
    }
}

//fornecedor do firestore
export const FirestoreProvider = {
    //o que eu quero fornecer
    provide: 'FIRESTORE',

    //como eu quero fornecer
    useFactory: (config: ConfigService) => {
        FirebaseManager.initializeFirebase(config)
        return getFirestore()
    },
    //o que eu preciso para fornecer (opcional)
    inject: [ConfigService]
}

export const AuthProvider = {
    //o que eu quero fornecer
    provide: 'AUTH',

    //como eu quero fornecer
    useFactory: (config: ConfigService) => {
        FirebaseManager.initializeFirebase(config)
        return getAuth()
    },
    //o que eu preciso para fornecer (opcional)
    inject: [ConfigService]
}