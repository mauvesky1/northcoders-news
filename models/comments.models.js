const knex = require("../db/connection");
const { checkExists } = require("../models/articles.models");

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
        return Promise.all([
          result,
          checkExists({
            table: "articles",
            field: "article_id",
            value: article_id
          })
        ]);
      }
      result.forEach(item => {
        delete item.article_id;
      });
      return [result];
    })
    .then(([result, boolean]) => {
      if (boolean === undefined || boolean === true) {
        return result;
      } else {
        return Promise.reject({ status: 404, msg: "Article Not Found" });
      }
    });
};
exports.patchComment = ({ comment_id }, { inc_votes }) => {
  return knex
    .select("*")
    .from("comments")
    .where("comment_id", comment_id)
    .modify(query => {
      if (inc_votes) {
        query.increment("votes", inc_votes);
      }
    })

    .returning("*")
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Nothing Found" });
      } else {
        return result[0];
      }
    });
};

exports.deleteComment = ({ comment_id }) => {
  return knex
    .select("*")
    .from("comments")
    .where("comment_id", comment_id)
    .del()
    .then(result => {
      if (result === 1) {
        return true;
      } else {
        return Promise.reject({ status: 404, msg: "Nothing found" });
      }
    });
};
