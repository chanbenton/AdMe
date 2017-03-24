exports.up = function(knex, Promise) {
  return knex.schema.dropTable('referrers')
  .alterTable('products', function (table) {
    table.string('img_path');
  })
  .alterTable('shared_links', function (table) {
    table.string('platform');
    table.unique(['products_id', 'users_id', 'platform']);

    table.float('cost');
    table.integer('click_count');
  })
  .createTable('stats', function(table) {
  	table.increments(); 
  	table.integer('sl_id');
    table.date('time');
    
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.createTable('referrers', function(table){
    table.increments();
    
    table.integer('sl_id');
    table.foreign('sl_id').references('shared_links.id');
    
    table.string('name');
    table.unique('name');

    table.float('cost');
    table.integer('click_count');
  })
  .alterTable('products', function(table){
  	table.dropColumn('img_path');
  })
  .alterTable('shared_links', function(table){
    table.dropUnique(['products_id', 'users_id', 'platform']);
    table.dropColumns(['platform','cost','click_count']);
  })
  .dropTable('stats');
};
