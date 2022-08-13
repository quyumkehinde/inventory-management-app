/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('users', function (t) {
        t.bigIncrements('id').unsigned().primary();
        t.string('first_name').notNullable();
        t.string('last_name').notNullable();
        t.string('email').unique().notNullable();
        t.string('password').notNullable();
        t.enum('user_type', ['customer', 'merchant']).notNullable();
        t.timestamps(true, true);
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('users');
}
