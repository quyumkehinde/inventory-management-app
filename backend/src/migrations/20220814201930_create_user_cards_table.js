/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('user_cards', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.bigInteger('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('cascade');
            // the data types are strings because we are saving the encrypted value.
            t.string('card_number').notNullable();
            t.string('expiry_date').notNullable();
            // not storing security code because we are not allowed, by law, to save the information.
        t.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('user_cards');
};
