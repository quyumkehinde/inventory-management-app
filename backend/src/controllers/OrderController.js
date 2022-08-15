import { body } from "express-validator";
import { sendError, sendSuccess } from './BaseController.js';
import { createOrder as _createOrder } from "../repositories/OrderRepository.js";
import { fetchItemById } from "../repositories/InventoryRepository.js";
import { createOrderItem } from "../repositories/OrderItemRepository.js";
import { logger } from "../config/Log.js";

export const createOrder = async (req, res) => {
    const { items, address, user } = req.body;
    try {
        let orderAmount = 0;
        for (let i = 0; i < items.length; i++) {
            const price = (await fetchItemById(items[i].id)).price;
            orderAmount += (price * items[i].quantity);
        }
        const order = await _createOrder(user.id, orderAmount, address);
        items.forEach(async item => {
            await createOrderItem(order.id, item.id, item.quantity);
        });
        return sendSuccess(res, 'Successfully created order.', order);
    } catch (error) {
        logger.error('Error occured while creating order', { error, req })
        return sendError(res);
    }
}

export const orderValidator = (method) => {
    switch (method) {
        case 'createOrder':
            return [
                body('items', 'The items field is required.')
                    .exists()
                    .isArray(1),
                body('items.*.id', 'The items.*.id field is required.').exists(),
                body('items.*.id').custom(itemId => {
                    return fetchItemById(itemId).then(item => {
                        if (!item) {
                            return Promise.reject('Please provide a valid items.*.id');
                        }
                    });
                }),
                body('items.*.quantity', 'Please provide a valid items.*.quantity.').isInt(),
                body('address', 'The address field is required').exists(),
            ];
    }
}