const knex = require("../db/connection");
const { comment_count } = require("./comments.models");

exports.fetchArticleById = ({ article_id }) => {
  return knex
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Nothing found" });
      }
      // const comment_countv = knex("comments")
      //   .count("article_id")
      //   .where("article_id", "=", article_id);

      return Promise.all([article[0], comment_count(article_id)]);
    })
    .then(([article, comment_count]) => {
      console.log(comment_count);
      article.comment_count = comment_count;
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
exports.fetchArticles = () => {
  return knex
    .select("*")
    .from("articles")
    .then(result => {
      if (result.length === 0) {
        return Promise.reject({ status: 404, msg: "Nothing found" });
      }
      result.forEach(article => {
        article.comment_count = comment_count(article.article_id);
        delete article.body;
      });

      return result;
    });
};
