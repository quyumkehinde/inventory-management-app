import { PAYMENT_METHODS, INVOICE_STATUSES } from '../utils/constants.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('invoices', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.decimal('amount', 19, 4).notNullable();
        t.bigInteger('order_id')
            .unsigned()
            .references('id')
            .inTable('orders')
            .onDelete('cascade');
        t.enum('payment_method', PAYMENT_METHODS).notNullable();
        t.enum('status', INVOICE_STATUSES).notNullable();
        t.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('invoices');
};
