import { sendError } from '../controllers/BaseController.js';
import { decryptJWT } from '../utils/auth.js';

export const IsCustomer = (req, res, next) => {
    const token = req.headers.authorization;
    const { userType } = decryptJWT(token.split(' ')[1]);
    if (userType !== 'customer') {
        return sendError(res, 'Unauthorized!', 401);
    }
    next();
};