import { authValidator, login, register } from './controllers/AuthController.js';
import { home } from './controllers/BaseController.js';
import { withdrawFund } from './controllers/TransactionController.js';
import { Router } from 'express';
import { Authenticate } from './middlewares/Authenticate.js';
import { IsCustomer } from './middlewares/IsCustomer.js';
import { IsMerchant } from './middlewares/IsMerchant.js';
import { addItem, deleteItem, editItem, fetchItem, fetchItems, inventoryValidator, seedItems } from './controllers/InventoryController.js';
import { Validate } from './middlewares/Validate.js';
import { createOrder, orderValidator } from './controllers/OrderController.js';

const routes = Router();

// unauthenticated routes
routes
    .get('/', home)
    .post('/register', authValidator('register'), register)
    .post('/login', login)
    .get('/inventory', fetchItems)
    .get('/inventory/:id', fetchItem)

// merchant routes
routes.use('/merchant', Authenticate, IsMerchant, Router()
    .post('/inventory', inventoryValidator('addItem'), Validate, addItem)
    .post('/inventory/seed', seedItems)
    .put('/inventory/:id', inventoryValidator('editItem'), Validate, editItem)
    .delete('/inventory/:id', deleteItem)
);

// customer routes
routes.use('/customer', Authenticate, IsCustomer, Router()
    .post('/order', orderValidator('createOrder'), Validate, createOrder)
);

export default routes;
