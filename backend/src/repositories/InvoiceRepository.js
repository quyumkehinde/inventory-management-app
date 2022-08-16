import { db } from '../config/Database.js';

export const createInvoice = async (orderId, amount, paymentMethod, status) => {
    const [id] = await db('invoices').insert({
        order_id: orderId,
        amount,
        payment_method: paymentMethod,
        status,
    });
    return findInvoiceById(id);
};

export const updateInvoice = async (id, status) => {
    await db('invoices')
        .update({ status })
        .where('id', id);
    return findInvoiceById(id);
};

export const findInvoiceById = async (id) => {
    return db('invoices')
        .where('id', id)
        .first();
};

export const fetchInvoices = async (userId, status) => {
    // Selecting only invoices with orders that belongs to the user.
    const orderIds = db('orders')
        .where('user_id', userId)
        .select('id');
    let query = db('invoices')
        .whereIn('order_id', orderIds);
    if (status) {
        query.where('status', status)
    }
    return query.orderBy('id', 'desc');
}

export const findInvoiceByOrderId = async (orderId) => {
    return db('invoices')
        .where('order_id', orderId)
        .first();
};