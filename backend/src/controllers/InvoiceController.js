import { body } from "express-validator";
import { findOrderById } from "../repositories/OrderRepository.js";
import { PAYMENT_METHODS } from "../utils/constants.js";
import { createInvoice as _createInvoice } from "../repositories/invoiceRepository.js";
import { sendError, sendSuccess } from "./BaseController.js";

export const createInvoice = (req, res) => {
    try {
        const { order_id: orderId, payment_method: paymentMethod } = req.body;
        const { amount } = findOrderById(orderId);
        const invoice = _createInvoice(orderId, amount, paymentMethod, 'pending');
        return sendSuccess(res, 'Successfully generated invoice invoice.', invoice)
    } catch (e) {
        console.log(e)
        return sendError(res)
    }
}

export const invoiceValidator = (method) => {
    switch (method) {
        case 'createInvoice':
            return [
                body('order_id', 'The order_id field is required.').exists(),
                body('order_id').custom(orderId => {
                    return findOrderById(orderId).then(item => {
                        if (!item) {
                            return Promise.reject('Please provide a valid order ID.');
                        }
                    });
                }),
                body('payment_method', 'The payment_method field is required.').exists(),
                body('payment_method', 'Please provide a valid payment method').isIn(PAYMENT_METHODS),
            ];
    }
}