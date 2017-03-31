
exports.up = function(knex, Promise) {
  return knex.schema.table('products', function (table) {
    table.dropColumn('desc');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('products', function (table) {
    table.string('desc');
  })
};
