import { authValidator, login, register } from './controllers/AuthController.js';
import { home } from './controllers/BaseController.js';
import { withdrawFund } from './controllers/TransactionController.js';
import { Router } from 'express';
import { Authenticate } from './middlewares/Authenticate.js';
import { IsCustomer } from './middlewares/IsCustomer.js';
import { IsMerchant } from './middlewares/IsMerchant.js';
import { addItem, editItem, inventoryValidator } from './controllers/InventoryController.js';

const routes = Router();

// unauthenticated routes
routes
    .get('/', home)
    .post('/register', authValidator('register'), register)
    .post('/login', login);

// merchant routes
routes.use('/merchant', Authenticate, IsMerchant, Router()
    .post('/inventory', inventoryValidator('addItem'), addItem)
    .put('/inventory', inventoryValidator('editItem'), editItem)
);

export default routes;
