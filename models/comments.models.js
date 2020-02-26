const knex = require("../db/connection");

exports.postComment = ({ article_id }, { username, body }) => {
  if (username === undefined || body === undefined) {
    return Promise.reject({ status: 400, msg: "Missing a necessary key" });
  }
  return knex
    .insert({ author: username, body, article_id })
    .into("comments")
    .returning("*")
    .then(result => {
      return result[0];
    });
};

exports.fetchCommentsById = (
  { article_id },
  { sort_by = "created_at", order_by = "desc" }
) => {
  if (order_by !== "asc" && order_by !== "desc") {
    order_by = "desc";
  }
  return knex
    .select("*")
    .from("comments")
    .where({ article_id })
    .orderBy(sort_by, order_by)
    .returning("*")
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
      result.forEach(item => {
        delete item.article_id;
      });
      return result;
    });
};
