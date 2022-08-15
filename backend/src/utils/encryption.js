import crypto from 'crypto';
import config from '../config.js';

const ENCRYPTION_ALGORITHM = 'aes-256-cbc'; // Note: Do not change!
const initVector = Buffer.from(config.ENCRYPTION_INIT_VECTOR, 'hex');
const securityKey = config.ENCRYPTION_SECURITY_KEY;

export const encrypt = (text) => {
    console.log(crypto.randomBytes(32).toString('hex'))
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, securityKey, initVector);
    const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
}

export const decrypt = (encrypted) => {
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, securityKey, initVector);
    const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
}
