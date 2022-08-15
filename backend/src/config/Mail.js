import nodemailer from 'nodemailer';
import config from '../config.js';

export const mail = nodemailer.createTransport({
    // NOTE: Using gmail because this is a local env and other options requires the project to be deployed on the internet 
    service: 'gmail',
    auth: {
        user: config.MAIL_AUTH_USER,
        pass: config.MAIL_AUTH_PASSWORD,
    },
    from: config.MAIL_AUTH_USER,
});
