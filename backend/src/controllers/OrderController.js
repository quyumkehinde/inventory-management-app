import { body } from "express-validator";
import { sendError, sendSuccess } from './BaseController.js';
import { createOrder as _createOrder } from "../repositories/OrderRepository";
import { fetchItemById } from "../repositories/InventoryRepository.js";
import { createOrderItem } from "../repositories/OrderItemRepository.js";

export const createOrder = async (req, res) => {
    const { items, address, user } = req.body;
    try {
        let order, orderAmount = 0;
        items.forEach(item => {
            const price = (await fetchItemById(item.id)).price;
            orderAmount += (price * item.quantity);
        });
        await db.transaction(async trx => {
            order = _createOrder(user.id, orderAmount, address, trx);
            items.forEach(item => {
                await createOrderItem(order.id, item.id, item.quantity, trx);
            });
        })
        return sendSuccess(res, 'Successfully created order.', order);
    } catch (e) {
        console.log(e)
        return sendError(res);
    }
}

export const orderValidator = () => {
    switch (method) {
        case 'createOrder':
            return [
                body('items', 'The items field is required.')
                    .exists()
                    .isArray(1),
                body('items.*.id').custom(itemId => {
                    return fetchItemById(itemId).then(item => {
                        if (!item) {
                            return Promise.reject('Please provide a valid item ID');
                        }
                    });
                }),
                body('items.*.quantity', 'Please provide a valid item quantity.').isInt(),
                body('address', 'The address field is required').exists(),
            ];
    }
}