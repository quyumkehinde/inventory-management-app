import { createUser, findUserByEmail } from '../repositories/UserRepository.js';
import { checkPassword, generateJWT } from '../utils/auth.js';
import { sendError, sendSuccess } from './BaseController.js';
import { body, validationResult } from 'express-validator';

export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, errors.array()[0].msg, 400);
    }

    try {
        const { first_name, last_name, email, user_type, password } = req.body;
        const [userId] = await createUser(first_name, last_name, email, user_type, password);
        return sendSuccess(res, 'Registration successful', {
            token: generateJWT(userId, user_type),
        });
    } catch (e) {
        console.log(e);
        if (e.code === 'ER_DUP_ENTRY') {
            return sendError(res, 'User with email already exist.', 400);
        }
        return sendError(res, 'Error occured! Please try again.');
    }
};

export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, errors.array()[0].msg);
    }

    try {
        const user = await findUserByEmail(req.body.email);
        if (!user || !await checkPassword(req.body.password, user.password)) {
            return sendError(res, 'Invalid username or password.', 400);
        }
        return sendSuccess(res, 'Successfully generated token.', {
            token: generateJWT(user.id, user.user_type),
        });
    } catch (e) {
        console.log(e);
        return sendError(res, 'Error occured! Please try again later.');
    }
};

export const authValidator = (method) => {
    switch (method) {
        case 'register':
            return [
                body('email', 'The email field is required.').exists(),
                body('email', 'Invalid email address.').isEmail(),
                body('first_name', 'The first_name field is required.').exists(),
                body('last_name', 'The last_name field is required.').exists(),
                body('password', 'The pasword field is required.').exists(),
                body('user_type', 'The user type is invalid.').isIn(['customer', 'merchant']),
            ];
        case 'login':
            return [
                body('email', 'The email field is required.').exists(),
                body('email', 'Invalid email address.').isEmail(),
                body('password', 'The pasword field is required.').exists(),
            ];
    }
}
