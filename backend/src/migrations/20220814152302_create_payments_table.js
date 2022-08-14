import { PAYMENT_METHODS } from '../utils/constants.js';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('payments', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.bigInteger('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('cascade');
        t.decimal('amount', 19, 4).notNullable();
        t.enum('method', PAYMENT_METHODS).notNullable();
        t.enum('status', ['paymentProcessor', 'transfer']).notNullable();
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
