export const DEFAULT_ERROR_MESSAGE = 'Error Occured! Please try again later.';
export const PAYMENT_METHODS = ['card'];
export const INVOICE_STATUSES = ['pending', 'paid'];
export const INVOICE_STATUS_PENDING = 'pending';
export const INVOICE_STATUS_PAID = 'paid';

export const DB_SEED_INVENTORY_ITEMS = [
    {
        name: 'Demo 1',
        description: 'This is a demo item.',
        price: 1000,
        quantity: 2,
        image_url: 'https://via.placeholder.com/150'
    },
    {
        name: 'Demo 2',
        description: 'This is a demo item.',
        price: 2000,
        quantity: 20,
        image_url: 'https://via.placeholder.com/150'
    },
    {
        name: 'Demo 3',
        description: 'This is a demo item.',
        price: 3000,
        quantity: 5,
        image_url: 'https://via.placeholder.com/150'
    },
]