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
    await db('invoices').update({
        status,
    }).where('id', id);
    return findInvoiceById(id);
};

export const findInvoiceById = async (id) => {
    return db('invoices')
        .where('id', id)
        .first();
};

export const fetchInvoices = async (status) => {
    let query = db('invoices');
    if (status) {
        console.log('hey')
        query.where('status', status)
    }
    return query.select();
}

export const findInvoiceByOrderId = async (orderId) => {
    return db('invoices')
        .where('order_id', orderId)
        .first();
};