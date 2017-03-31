
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('products', function (table) {
    table.text('desc');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('products', function (table) {
    table.dropColumn('desc');
  })
};
