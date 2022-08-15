import { db } from '../config/Database.js';

export const createOrder = async (userId, amount, address) => {
    const [id] = await db('orders').insert({
        user_id: userId,
        amount,
        address,
    });
    return findOrderById(id);
};

export const findOrderById = async (id) => {
    return db('orders')
        .where('id', id)
        .first();
};
