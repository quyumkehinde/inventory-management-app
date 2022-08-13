/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('inventory_items', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.text('name').notNullable();
        t.decimal('price', 19, 4).notNullable();
        t.bigInteger('merchant_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('cascade');
        t.integer('quantity').notNullable();
        t.string('image_url').notNullable(); // NOTE: Product image would have its own separate table in a production code. Doing this to reduce complexity.
        t.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('inventory_items');
};
