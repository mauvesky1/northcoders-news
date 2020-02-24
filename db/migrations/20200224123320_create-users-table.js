exports.up = function(knex) {
  return knex.schema.createTable("users", usersTable => {
    usersTable.string("username").primary();
    usersTable.string("name").notNullable();
    usersTable.string("avatar_url");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
