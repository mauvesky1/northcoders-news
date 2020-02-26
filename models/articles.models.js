const knex = require("../db/connection");

exports.fetchArticleById = ({ article_id }) => {
  return knex
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", article_id)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Nothing found" });
      }
      return article[0];
    })
    .then(article => {
      return article;
    });
};

exports.patchArticle = ({ article_id }, { inc_votes }) => {
  return knex
    .select("*")
    .from("articles")
    .where({ article_id })
    .increment("votes", inc_votes)
    .returning("*")
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Nothing Found" });
      }
      return result[0];
    });
};
exports.fetchArticles = ({ sort_by = "title", order_by = "desc", author }) => {
  if (order_by !== "asc" && order_by !== "desc") {
    order_by = "desc";
  }
  return knex
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")

    .orderBy(sort_by, order_by)
    .modify(query => {
      if (author) {
        query.where("articles.author", author);
      }
    })
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Nothing found" });
      }
      result.forEach(article => {
        delete article.body;
      });
      return result;
    });
};
