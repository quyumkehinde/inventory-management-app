import dotenv from 'dotenv';
dotenv.config();

export default {
    APP_NAME: process.env.APP_NAME,
    APP_ENV: process.env.APP_ENV,
    APP_URL: process.env.APP_URL,
    APP_PORT: process.env.APP_PORT,
    DB_CONNECTION: process.env.DB_CONNECTION,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    ENCRYPTION_INIT_VECTOR: process.env.ENCRYPTION_INIT_VECTOR,
    ENCRYPTION_SECURITY_KEY: process.env.ENCRYPTION_SECURITY_KEY,
    MAIL_AUTH_USER: process.env.MAIL_AUTH_USER,
    MAIL_AUTH_PASSWORD: process.env.MAIL_AUTH_PASSWORD,
};