import { db } from '../config/Database.js';
import { createTransaction, findTransactionById } from '../repositories/TransactionRepository.js';
import { decrementUserBalance, findUserById, incrementUserBalance } from '../repositories/UserRepository.js';
import { decryptJWT } from '../utils/auth.js';
import { sendSuccess, sendError } from './BaseController.js';
import { InsufficientBalanceException } from '../exceptions/TransactionExceptions.js';
import { createTransfer } from '../repositories/TransferRepository.js';

export const depositFund = async (req, res) => {
    const token = req.headers.authorization;
    if (!req.body.amount) {
        return sendError(res, 'The amount field is required', 400);
    }
    if (req.body.amount <= 0) {
        return sendError(res, 'The minimum deposit is 1', 400);
    }
    
    try {
        let transactionId;
        await db.transaction(async trx => {
            const { id: userId } = decryptJWT(token.split(' ')[1]);
            [transactionId] = await Promise.all([
                createTransaction(userId, req.body.amount, 'credit', 'paymentProcessor', trx),
                incrementUserBalance(userId, req.body.amount, trx),
            ]);
        });
        const transaction = await findTransactionById(transactionId[0]);
        return sendSuccess(res, 'Successfully funded account.', transaction);
    } catch (err) {
        console.log(err);
        return sendError(res, 'Error occured! Please try again.', 500);
    }
};

export const withdrawFund = async (req, res) => {
    const token = req.headers.authorization;
    if (!req.body.amount) {
        return sendError(res, 'The amount field is required', 400);
    }
    if (req.body.amount <= 0) {
        return sendError(res, 'The minimum withdrawal is 1', 400);
    }

    let transactionId;
    try {
        await db.transaction(async trx => {
            const { id: userId } = decryptJWT(token.split(' ')[1]);
            const user = await findUserById(userId, trx);
            if (user.account_balance < req.body.amount) {
                throw new InsufficientBalanceException();
            }
            [transactionId] = await Promise.all([
                createTransaction(userId, req.body.amount, 'debit', 'paymentProcessor', trx),
                decrementUserBalance(userId, req.body.amount, trx),
            ]);
        });
        const transaction = await findTransactionById(transactionId[0]);
        return sendSuccess(res, 'Withdrawal has been processed successfully.', transaction);
    } catch (err) {
        console.log(err);
        if (err.name === 'InsufficientBalanceException') {
            return sendError(res, err.message, 400);
        }
        return sendError(res, 'Error occured! Please try again.', 500);
    }
};

export const transferFund = async (req, res) => {
    const token = req.headers.authorization;
    if (!req.body.amount) {
        return sendError(res, 'The amount field is required', 400);
    }
    if (!req.body.recipient_id) {
        return sendError(res, 'The recipient_id field is required', 400);
    }
    if (req.body.amount <= 0) {
        return sendError(res, 'The minimum amount you can transfer is 1', 400);
    }
    const { id: userId } = decryptJWT(token.split(' ')[1]);
    const recipientId = req.body.recipient_id, amount = req.body.amount;
    
    if (recipientId === userId || !await findUserById(recipientId)) {
        return sendError(res, 'The recipient ID is invalid.', 400);
    }

    try {
        let debitId, creditId;
        await db.transaction(async trx => {
            const [user, recipient] = await Promise.all([
                findUserById(userId, trx),
                findUserById(recipientId, trx),
            ]);
            if (user.account_balance < amount) {
                throw new InsufficientBalanceException();
            }
            [debitId, creditId] = await Promise.all([
                createTransaction(user.id, amount, 'debit', 'transfer', trx),
                createTransaction(recipient.id, amount, 'credit', 'transfer', trx),
                decrementUserBalance(user.id, amount, trx),
                incrementUserBalance(recipient.id, amount, trx),
            ]);
            await createTransfer(creditId, debitId, amount, trx);
        });
        const transaction = await findTransactionById(debitId[0]);
        return sendSuccess(res, 'Transfer completed successfully.', transaction);
    } catch (err) {
        console.log(err);
        if (err.name === 'InsufficientBalanceException') {
            return sendError(res, err.message, 400);
        }
        return sendError(res, 'Error occured! Please try again.', 500);
    }
};

