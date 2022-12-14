import { body, param } from "express-validator";
import { findOrderById } from "../repositories/OrderRepository.js";
import { PAYMENT_METHODS, INVOICE_STATUSES, INVOICE_STATUS_PAID, INVOICE_STATUS_PENDING, MAIL_SUCCESSFUL_PAYMENT_SUBJECT } from "../utils/constants.js";
import { createInvoice as _createInvoice, findInvoiceById, findInvoiceByOrderId, updateInvoice } from "../repositories/InvoiceRepository.js";
import { sendError, sendSuccess } from "./BaseController.js";
import { fetchInvoices as _fetchInvoices } from "../repositories/InvoiceRepository.js";
import { createUserCard, findCardById } from "../repositories/UserCardRepository.js";
import { mail } from "../config/Mail.js";
import { logger } from "../config/Log.js";

export const createInvoice = async (req, res) => {
    try {
        const { order_id: orderId, payment_method: paymentMethod } = req.body;
        if (await findInvoiceByOrderId(orderId)) {
            return sendError(res, 'Invoice already generated for order.', 401);
        }
        const { amount } = await findOrderById(orderId);
        const invoice = await _createInvoice(orderId, amount, paymentMethod, INVOICE_STATUS_PENDING);
        return sendSuccess(res, 'Successfully generated invoice invoice.', invoice)
    } catch (error) {
        logger.error('Error occured while creating invoice', { error, req })
        return sendError(res);
    }
}

export const payInvoiceNewCard = async (req, res) => {
    try {
        const invoice = await findInvoiceById(req.params.id);
        if (!invoice) {
            return sendError(res, 'The invoice ID is invalid.', 400);
        }
        if (invoice.status === INVOICE_STATUS_PAID) {
            return sendError(res, 'The invoice has already been paid!', 400);
        }
        const { card_number, expiry_month, expiry_year, security_code, save_card, user } = req.body;
        // NOTE: In production code, some logic to debit card goes here.
        // We would typically integrate with a payment provider like Flutterwave, Paystack, etc
        // to handle payment. We shouldn't be storing users' card details unless we have the appropriate
        // cerifications to do so.
        if (save_card) {
            await createUserCard(user.id, card_number, expiry_month, expiry_year, security_code);
        }
        const receipt = await updateInvoice(invoice.id, INVOICE_STATUS_PAID);
        sendPaymentSuccessMail(user, invoice);
        return sendSuccess(res, 'Successfully paid for item', receipt);
    } catch (error) {
        logger.error('Error occured while processing transaction.', { error, req })
        return sendError(res);
    }
}

export const payInvoiceSavedCard = async (req, res) => {
    try {
        const invoice = await findInvoiceById(req.params.id);
        if (!invoice) {
            return sendError(res, 'The invoice ID is invalid.', 400);
        }
        if (invoice.status === INVOICE_STATUS_PAID) {
            return sendError(res, 'The invoice has already been paid!', 400);
        }
        const { card_id, user } = req.body;
        const card = await findCardById(card_id);
        if (!card || card.user_id !== user.id) {
            return sendError(res, 'The card ID is invalid!', 400);
        }
        // NOTE: In production code, some logic to debit card goes here.
        // We would typically integrate with a payment provider like Flutterwave, Paystack, etc
        // to handle payment.
        const receipt = await updateInvoice(invoice.id, INVOICE_STATUS_PAID);
        sendPaymentSuccessMail(user, invoice);
        return sendSuccess(res, 'Successfully paid for item', receipt);
    } catch (error) {
        logger.error('Error occured while processing transaction.', { error, req })
        return sendError(res);
    }
}

export const fetchInvoices = async (req, res) => {
    try {
        const invoices = await _fetchInvoices(req.body.user.id, req.query.status);
        return sendSuccess(res, 'Successfully fetched invoices.', invoices);
    } catch (error) {
        logger.error('Error occured while fetching invoices.', { error, req })
        return sendError(res);
    }
}

const sendPaymentSuccessMail = (user, invoice) => {
    const mailOptions = {
        to: user.email,
        subject: MAIL_SUCCESSFUL_PAYMENT_SUBJECT,
        text: `Successfully paid ${invoice.amount} for invoice #${invoice.id}`
    }
    mail.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error('Error occured while sending mail', { error });
        }
    });
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
        case 'payInvoiceNewCard':
            return [
                body('card_number')
                    .exists()
                    .withMessage('The card number field is required.')
                    .isInt()
                    .withMessage('The card number is invalid.'),
                body('expiry_month')
                    .exists()
                    .withMessage('The expiry month field is required.')
                    .isInt()
                    .withMessage('The expiry month is invalid.')
                    .custom(value => {
                        if (value > 12 || value < 1) {
                            throw new Error('The expiry month is invalid.')
                        }
                        return true;
                    }),
                body('expiry_year')
                    .exists()
                    .withMessage('The expiry year field is required.')
                    .isInt()
                    .withMessage('The expiry year is invalid.')
                    .custom(value => {
                        if (String(value).length !== 4) {
                            throw new Error('The expiry year is invalid.')
                        }
                        return true;
                    }),
                body('security_code')
                    .exists()
                    .withMessage('The security code field is required.')
                    .isInt()
                    .withMessage('The security code is invalid.')
                    .custom(value => {
                        if (String(value).length > 4) {
                            throw new Error('The security code is invalid.')
                        }
                        return true;
                    }),
                body('save_card')
                    .optional()
                    .isBoolean()
                    .withMessage('Please provide a boolean value in the save_card field.')             
            ];
        case 'payInvoiceSavedCard':
            return [
                body('card_id', 'The card id field is required.').exists()
            ];
        case 'fetchInvoices':
            return [
                param('status', 'The provided status is invalid.')
                    .optional()
                    .isIn(INVOICE_STATUSES),
            ];
    }
}