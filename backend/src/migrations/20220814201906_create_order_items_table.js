/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
     return knex.schema.createTable('order_items', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.bigInteger('order_id')
            .unsigned()
            .references('id')
            .inTable('orders')
            .onDelete('cascade');
        t.bigInteger('item_id')
            .unsigned()
            .nullable()
            .references('id')
            .inTable('inventory_items')
            .onDelete('set null');
        t.integer('quantity').notNullable();
        t.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('order_items');
};
