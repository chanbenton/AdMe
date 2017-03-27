exports.up = function(knex, Promise) {
  
  return knex.schema.alterTable('shared_links', function(table){
    table.dropUnique(['products_id', 'users_id', 'platform']);
   });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('shared_links', function(table){
    table.unique(['products_id', 'users_id', 'platform']); 
  });
};
