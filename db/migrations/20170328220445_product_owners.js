exports.up = function(knex, Promise) {
  return knex.schema.alterTable('products', function (table) {
    table.integer('creator_uid');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('products', function (table) {
    table.dropColumn('creator_uid');
  })
};