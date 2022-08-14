import { createUser, findUserByEmail } from '../repositories/UserRepository.js';
import { checkPassword, generateJWT } from '../utils/auth.js';
import { sendError, sendSuccess } from './BaseController.js';
import { body } from 'express-validator';
import { DEFAULT_ERROR_MESSAGE } from '../utils/constants.js';

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, user_type, password } = req.body;
        if (await findUserByEmail(email)) {
            return sendError(res, 'User with email already exist.', 400);
        }
        const user = await createUser(first_name, last_name, email, user_type, password);
        return sendSuccess(res, 'Registration successful', {
            token: generateJWT(user.id, user.user_type),
        });
    } catch (e) {
        console.log(e);
        return sendError(res);
    }
};

export const login = async (req, res) => {
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
        return sendError(res);
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
