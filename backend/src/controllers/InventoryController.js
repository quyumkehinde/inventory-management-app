import { body, validationResult } from 'express-validator';
import { createItem, findItemById, updateItem } from '../repositories/InventoryRepository.js';
import { DEFAULT_ERROR_MESSAGE } from '../utils/constants.js';
import { sendError, sendSuccess } from './BaseController.js';

export const addItem = async (req, res) => {
    try {
        const {name, price, quantity, image_url, user: merchant} = req.body;
        const data = await createItem(name, price, merchant.id, quantity, image_url);
        return sendSuccess(res, data, 'Successfully created inventory item.')
    } catch (e) {
        console.log(e);
        return sendError(res, DEFAULT_ERROR_MESSAGE, 500)
    }
}

export const editItem = async (req, res) => {
    const {id, name, price, quantity, image_url, user: merchant} = req.body;
    const item = await findItemById(id);
    if (!item || item.merchant_id !== merchant.id) {
        return sendError(res, 'The item ID is invalid.', 401);
    }
    try {
        const data = await updateItem(id, name, price, quantity, image_url);
        return sendSuccess(res, data, 'Successfully updated inventory item.')
    } catch (e) {
        console.log(e);
        return sendError(res, DEFAULT_ERROR_MESSAGE, 500)
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
