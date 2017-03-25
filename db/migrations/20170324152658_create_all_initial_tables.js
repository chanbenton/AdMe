exports.up = function(knex, Promise) {

  /* Creates tables through chaining, provided no semi-colon is provided until the last createTable command
   * table.increments(); creates the id column
   */
  return knex.schema.alterTable('users', function (table) {
    table.string('email');
    table.unique('email');

    table.string('role');
    table.string('password');
  })

  .createTable('products', function(table){
  	table.increments(); 
  	table.string('title');
    table.string('desc');
  })

  .createTable('shared_links', function(table){
   	table.increments(); 
   	
    table.integer('products_id');
    table.foreign('products_id').references('products.id');

    table.integer('users_id');
    table.foreign('users_id').references('users.id');
  })

  .createTable('referrers', function(table){
    table.increments();
    
    table.integer('sl_id');
    table.foreign('sl_id').references('shared_links.id');
    
    table.string('name');
    table.unique('name');

    table.float('cost');
    table.integer('click_count');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', function (table){
  	table.dropColumns('email','role','password');
  })
  .dropTable('referrers')
  .dropTable('shared_links')
  .dropTable('products')
};