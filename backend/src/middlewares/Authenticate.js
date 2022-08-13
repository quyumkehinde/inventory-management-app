import { sendError } from '../controllers/BaseController.js';
import { findUserById } from '../repositories/UserRepository.js';
import { decryptJWT, isValidBearerToken } from '../utils/auth.js';

export const Authenticate = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!isValidBearerToken(token)) {
        return sendError(res, 'Unauthorized!', 401);
    }
    const { userId } = decryptJWT(token.split(' ')[1]);
    req.body.user = await findUserById(userId);
    next();
};