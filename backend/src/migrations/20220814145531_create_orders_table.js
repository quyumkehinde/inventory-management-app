/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable('orders', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.decimal('amount', 19, 4).notNullable();
        t.bigInteger('user_id')
            .unsigned()
            .references('id')
            .inTable('users')
            .onDelete('set null');
        t.bigInteger('payment_id')
            .unsigned()
            .references('id')
            .inTable('payments')
            .onDelete('set null');
        t.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('orders');
};
