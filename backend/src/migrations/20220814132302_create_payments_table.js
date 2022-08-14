import { PAYMENT_METHODS, PAYMENT_STATUSES } from '../utils/constants.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('payments', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.decimal('amount', 19, 4).notNullable();
        t.enum('method', PAYMENT_METHODS).notNullable();
        t.enum('status', PAYMENT_STATUSES).notNullable();
        t.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('payments');
};
