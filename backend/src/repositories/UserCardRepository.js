import { db } from '../config/Database.js';
import { decrypt, encrypt } from '../utils/encryption.js';

export const createUserCard = async (userId, cardNumber, expiryMonth, expiryYear, securityCode) => {
    return await db('user_cards').insert({
        user_id: userId,
        // encrypting the card details before storing in the DB
        card_number: encrypt(String(cardNumber)),
        expiry_date: encrypt(String(expiryMonth + '-' + expiryYear)),
        security_code: encrypt(String(securityCode)),
    });
};

export const findCardById = async (id) => {
    return db('user_cards')
        .where('id', id)
        .select(['user_id', 'id', 'card_number'])
        .first();
};

export const fetchCards = async (userId) => {
    const cards = await db('user_cards')
        .where('user_id', userId)
        .select(['id', 'card_number'])
        .orderBy('id', 'desc');;
    // decrypt card_number and replace with it's last 4 digits
    cards.forEach(card => {
        const cardNumber = decrypt(card.card_number);
        card.card_number = cardNumber.substring(cardNumber.length - 4);
    });
    return cards;
}
