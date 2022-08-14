import { authValidator, login, register } from './controllers/AuthController.js';
import { home } from './controllers/BaseController.js';
import { withdrawFund } from './controllers/TransactionController.js';
import { Router } from 'express';
import { Authenticate } from './middlewares/Authenticate.js';
import { IsCustomer } from './middlewares/IsCustomer.js';
import { IsMerchant } from './middlewares/IsMerchant.js';
import { addItem, deleteItem, editItem, fetchItems, inventoryValidator } from './controllers/InventoryController.js';
import { Validate } from './middlewares/Validate.js';

const routes = Router();

// unauthenticated routes
routes
    .get('/', home)
    .post('/register', authValidator('register'), register)
    .post('/login', login);

// merchant routes
routes.use('/merchant', Authenticate, IsMerchant, Router()
    .get('/inventory', fetchItems)
    .post('/inventory', inventoryValidator('addItem'), Validate, addItem)
    .put('/inventory/:id', inventoryValidator('editItem'), Validate, editItem)
    .delete('/inventory/:id', deleteItem)
);

export default routes;
