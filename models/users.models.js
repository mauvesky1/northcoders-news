const knex = require("../db/connection");

exports.fetchUserById = ({ username }) => {
  return knex
    .select("*")
    .from("users")
    .where("username", "=", username)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Nothing found" });
      }
      return result[0];
    });
};
