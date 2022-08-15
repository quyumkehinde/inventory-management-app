import { login, register } from '../../src/controllers/AuthController.js'; 
import * as BaseController from '../../src/controllers/BaseController.js';
import * as UserRepository from '../../src/repositories/UserRepository.js';
import * as auth from '../../src/utils/auth.js';

const successResponse = (res, message, data) => {
    return { body: { success: true, message, data} };
};

const user = {
    id: 1,
    email: 'mail@domain.com',
    account_balance: 100
};

const errorResponse = (res, message, statusCode) => {
    return { 
        statusCode: statusCode || 500,
        body: { success: false, message }
    };
}
const res = { headers: {}, body: {}};

describe('authentication', () => {
    beforeEach(() => {
        jest.spyOn(BaseController, 'sendError')
            .mockImplementationOnce(errorResponse);
        jest.spyOn(BaseController, 'sendSuccess')
            .mockImplementationOnce(successResponse);
    });

    describe('registration', () => {
        test('user can create an account', async () => {
            const req = { body: { email: 'test@domain.com', password : 'password' } };
            jest.spyOn(UserRepository, 'findUserByEmail')
                .mockReturnValueOnce(new Promise(resolve => resolve(undefined)));
            jest.spyOn(UserRepository, 'createUser')
                .mockReturnValueOnce(new Promise(resolve => resolve([1])));
            jest.spyOn(auth, 'generateJWT')
                .mockReturnValueOnce('token');

            const response = await register(req, res);
            expect(response.body.data.token).toBe('token');
            expect(response.body.success).toBe(true);
        });
    });

    describe('login', () => {
        test('user can generate token', async () => {
            const req = { body: { email: 'test@domain.com', password : 'password' } };
            jest.spyOn(UserRepository, 'findUserByEmail')
                .mockReturnValueOnce(new Promise(resolve => resolve(user)));
            jest.spyOn(auth, 'checkPassword')
                .mockReturnValueOnce(new Promise(resolve => resolve(true)));
            jest.spyOn(auth, 'generateJWT')
                .mockReturnValueOnce('token');

            const response = await login(req, res);
            expect(response.body.data.token).toBe('token');
            expect(response.body.success).toBe(true);
        });

        test('user get an error for incorrect credentials', async () => {
            const req = { body: { email: 'test@domain.com', password : 'wrongPassword' } };
            jest.spyOn(UserRepository, 'findUserByEmail')
                .mockReturnValueOnce(new Promise(resolve => resolve(user)));
            jest.spyOn(auth, 'checkPassword')
                .mockReturnValueOnce(new Promise(resolve => resolve(false)));
            jest.spyOn(auth, 'generateJWT')
                .mockReturnValueOnce('token');

            const response = await login(req, res);
            expect(response.body.message).toBe('Invalid username or password.');
            expect(response.body.success).toBe(false);
        });
    });
})