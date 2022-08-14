import { db } from '../config/Database.js';

export const createOrder = async (userId, amount, address, trx) => {
    let query = db('orders').insert({
        user_id: userId,
        amount,
        address,
    });
    if (trx) query.transacting(trx);
    const [id] = await query;
    return findOrderById(id);
};

export const findOrderById = async (id) => {
    return db('orders')
        .where('id', id)
        .first();
};
