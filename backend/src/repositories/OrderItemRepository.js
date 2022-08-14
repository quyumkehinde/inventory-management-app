import { db } from '../config/Database.js';

export const createOrderItem = async (orderId, itemId, quantity, trx) => {
    let query = db('order_items').insert({
        order_id: orderId,
        item_id: itemId,
        quantity,
    });
    if (trx) query.transacting(trx);
    const [id] = await query;
    return findOrderItemById(id);
};

export const findOrderItemById = async (id) => {
    return db('order_items')
        .where('id', id)
        .first();
};
