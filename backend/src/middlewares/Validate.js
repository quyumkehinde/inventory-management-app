import { validationResult } from 'express-validator';
import { sendError } from '../controllers/BaseController.js';

export const Validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, errors.array()[0].msg, 401);
    }
    next();
}
