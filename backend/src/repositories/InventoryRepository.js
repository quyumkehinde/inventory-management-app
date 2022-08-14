import { db } from '../config/Database.js';

export const createItem = async (name, description, price, merchantId, quantity, imageUrl) => {
    const [id] = await db('inventory_items').insert({
        name,
        description,
        price,
        merchant_id: merchantId,
        quantity,
        image_url: imageUrl,
    });
    return fetchItemById(id);
};

export const updateItem = async (id, name, description, price, quantity, imageUrl) => {
    await db('inventory_items').update({
        name,
        description,
        price,
        quantity,
        image_url: imageUrl,
    }).where('id', id);
    return fetchItemById(id);
};

export const deleteItem = async (id) => {
    return db('inventory_items')
        .where('id', id)
        .delete();
};

export const fetchItemById = async (id) => {
    return db('inventory_items')
        .where('id', id)
        .first();
};

export const fetchItems = async (merchantId) => {
    let items = db('inventory_items');
    if (merchantId) {
        items.where('merchant_id', merchantId);
    }
    return items.select();
};