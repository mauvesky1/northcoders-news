const knex = require("../db/connection");

exports.fetchArticleById = ({ article_id }) => {
  return knex
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Nothing found" });
      }
      return result[0];
    });
};
