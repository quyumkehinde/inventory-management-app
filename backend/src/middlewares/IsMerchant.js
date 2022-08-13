import { sendError } from '../controllers/BaseController.js';
import { decryptJWT } from '../utils/auth.js';

export const IsMerchant= (req, res, next) => {
    const token = req.headers.authorization;
    const { userType } = decryptJWT(token.split(' ')[1]);
    if (userType !== 'merchant') {
        return sendError(res, 'Unauthorized!', 401);
    }
    next();
};