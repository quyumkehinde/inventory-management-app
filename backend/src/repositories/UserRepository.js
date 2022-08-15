import { db } from '../config/Database.js';
import { hashPassword } from '../utils/auth.js';

export const createUser = async (firstName, lastName, email, userType, password) => {
    const [id] = await db('users').insert({
        first_name: firstName,
        last_name: lastName,
        email,
        user_type: userType,
        password: await hashPassword(password),
    });
    return findUserById(id);
};

export const findUserByEmail = async (email) => {
    return db('users')
        .where('email', email)
        .first();
};

export const findUserById = async (id) => {
    return db('users')
        .where('id', id)
        .first();
};
