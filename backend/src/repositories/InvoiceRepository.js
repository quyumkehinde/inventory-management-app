import { db } from '../config/Database.js';

export const createInvoice = async (orderId, amount, method, status, status) => {
    const [id] = await db('invoices').insert({
        order_id: orderId,
        amount,
        method,
        status,
        address,
    });
    return findInvoiceById(id);
};

export const findInvoiceById = async (id) => {
    return db('invoices')
        .where('id', id)
        .first();
};
