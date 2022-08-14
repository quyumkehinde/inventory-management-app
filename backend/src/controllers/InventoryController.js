import { body, validationResult } from 'express-validator';
import { createItem, findItemById, updateItem } from '../repositories/InventoryRepository.js';
import { DEFAULT_ERROR_MESSAGE } from '../utils/constants.js';
import { sendError, sendSuccess } from './BaseController.js';
import { deleteItem as _deleteItem } from '../repositories/InventoryRepository.js';
import { fetchItems as _fetchItems } from '../repositories/InventoryRepository.js';

export const addItem = async (req, res) => {
    try {
        const { name, price, quantity, image_url, user: merchant } = req.body;
        const data = await createItem(name, price, merchant.id, quantity, image_url);
        return sendSuccess(res, 'Successfully created inventory item.', data)
    } catch (e) {
        console.log(e);
        return sendError(res);
    }
}

export const editItem = async (req, res) => {
    const { name, price, quantity, image_url, user: merchant } = req.body;
    const item = await findItemById(req.params.id);
    if (!item || item.merchant_id !== merchant.id) {
        return sendError(res, 'The item ID is invalid.', 401);
    }
    try {
        const data = await updateItem(req.params.id, name, price, quantity, image_url);
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
