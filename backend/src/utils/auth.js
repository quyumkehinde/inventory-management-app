import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { logger } from '../config/Log.js';

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const checkPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateJWT = (userId, userType) => {
    return jwt.sign({ userId, userType }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN
    });
};

export const decryptJWT = (token) => {
    return jwt.decode(token);
};

export const isValidBearerToken = (token) => {
    try {
        if (!token || !token.startsWith('Bearer ') || !jwt.verify(token.split(' ')[1], config.JWT_SECRET)) {
            return false;
        }
        const { iat, exp } = decryptJWT(token.split(' ')[1]);
        const timeStamp = Math.floor(Date.now() / 1000);

        if (iat > timeStamp || exp < timeStamp) {
            return false;
        }
    } catch (error) {
        logger.error('Error occured while validating token.', { error, req })
        return sendError(res);
    }
    return true;
};