import { body } from 'express-validator';
import { createItem, findItemById, updateItem } from '../repositories/InventoryRepository.js';
import { DB_SEED_INVENTORY_ITEMS } from '../utils/constants.js';
import { sendError, sendSuccess } from './BaseController.js';
import { deleteItem as _deleteItem, fetchItems as _fetchItems } from '../repositories/InventoryRepository.js';

export const addItem = async (req, res) => {
    try {
        const { name, description, price, quantity, image_url, user: merchant } = req.body;
        const data = await createItem(name, description, price, merchant.id, quantity, image_url);
        return sendSuccess(res, 'Successfully created inventory item.', data)
    } catch (e) {
        console.log(e);
        return sendError(res);
    }
}

export const editItem = async (req, res) => {
    const { name, description, price, quantity, image_url, user: merchant } = req.body;
    const item = await findItemById(req.params.id);
    if (!item || item.merchant_id !== merchant.id) {
        return sendError(res, 'The item ID is invalid.', 401);
    }
    try {
        const data = await updateItem(req.params.id, name, description, price, quantity, image_url);
        return sendSuccess(res, 'Successfully updated inventory item.', data)
    } catch (e) {
        console.log(e);
        return sendError(res)
    }
}

export const deleteItem = async (req, res) => {
    const item = await findItemById(req.params.id);
    if (!item || item.merchant_id !== req.body.user.id) {
        return sendError(res, 'The item ID is invalid.', 401);
    }
    try {
        const deleted = await _deleteItem(id);
        const data = { deleted: Boolean(deleted) };
        return sendSuccess(res, 'Successfully deleted inventory item.', data);
    } catch (e) {
        console.log(e);
        return sendError(res)
    }
}

export const fetchItems = async (req, res) => {
    const data = await _fetchItems(req.query.merchant_id);
    return sendSuccess(res, 'Successfully fetched inventory items', data);
}

export const seedItems = async (req, res) => {
    try {
        const data = { items: [] }
        for (let i = 0; i < DB_SEED_INVENTORY_ITEMS.length; i++) {
            const seedItem = DB_SEED_INVENTORY_ITEMS[i];
            const item = await createItem(
                seedItem.name,
                seedItem.description,
                seedItem.price,
                req.body.user.id,
                seedItem.quantity,
                seedItem.image_url
            );
            data.items.push(item);
        }
        return sendSuccess(res, 'Successfully added dummy inventory items.', data)
    } catch (e) {
        console.log(e);
        return sendError(res);
    }
}

export const inventoryValidator = (method) => {
    switch (method) {
        case 'addItem':
        case 'editItem':
            return [
                body('name', 'The name field is required.').exists(),
                body('price')
                    .exists()
                    .withMessage('The price field is required.')
                    .isNumeric()
                    .withMessage('Please enter a valid number in the price field.'),
                body('quantity')
                    .exists()
                    .withMessage('The quantity field is required.')
                    .isInt()
                    .withMessage('Please enter a valid number in the quantity field.'),
                body('image_url')
                    .exists()
                    .withMessage('The image_url field is required.')
                    .isURL()
                    .withMessage('Please enter a valid URL in the image_url field'),
            ];
    }
}
