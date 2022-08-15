import { db } from '../config/Database.js';

export const createOrderItem = async (orderId, itemId, quantity) => {
    const [id] = await db('order_items').insert({
        order_id: orderId,
        item_id: itemId,
        quantity,
    });
    return findOrderItemById(id);
};

export const findOrderItemById = async (id) => {
    return db('order_items')
        .where('id', id)
        .first();
};
