import { db } from '../config/Database.js';
import { decrypt, encrypt } from '../utils/encryption.js';

export const createUserCard = async (userId, cardNumber, expiryMonth, expiryYear, securityCode) => {
    return await db('user_cards').insert({
        user_id: userId,
        card_number: encrypt(String(cardNumber)),
        expiry_date: encrypt(String(expiryMonth + '-' + expiryYear)),
        security_code: encrypt(String(securityCode)),
    });
};

export const findCardById = async (id) => {
    return db('user_cards')
        .where('id', id)
        .select(['id', 'card_number'])
        .first();
};

export const fetchCards = async (userId) => {
    return db('user_cards')
        .where('user_id', userId);
}
