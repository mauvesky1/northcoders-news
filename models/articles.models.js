const knex = require("../db/connection");

fetchArticleById = ({ article_id }) => {
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

patchArticle = ({ article_id }, { inc_votes }) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Missing votes input" });
  }
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
fetchArticles = ({
  sort_by = "created_at",
  order_by = "desc",
  author,
  topic
}) => {
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
      if (topic) {
        query.where("articles.topic", topic);
      }
    })
    .then(result => {
      result.forEach(article => {
        delete article.body;
      });
      if (result.length === 0 && author && topic) {
        return Promise.all([
          result,
          checkAuthorExists(author),
          checkTopicExists({ topic })
        ]);
      } else if (result.length === 0 && topic) {
        return Promise.all([result, , checkTopicExists({ topic })]);
      } else if (result.length === 0 && author) {
        return Promise.all([result, checkAuthorExists(author)]);
      } else {
        return Promise.all([result]);
      }
    })
    .then(result => {
      if (
        (result[1] === true && result[2] === true) ||
        (result[1] === undefined && result[2] === true) ||
        (result[1] === undefined && result[2] === undefined) ||
        (result[1] === true && result[2] === undefined)
      ) {
        return result[0];
      } else {
        return Promise.reject({ status: 404, msg: "Nothing found" });
      }
    });
};

checkAuthorExists = author => {
  return knex
    .select("username")
    .from("users")
    .where("username", author)
    .then(list => {
      if (list.length !== 0) {
        return true;
      } else return false;
    });
};

checkTopicExists = ({ topic, author }) => {
  return knex
    .select("*")
    .modify(query => {
      if (topic) {
        query.from("topics").where("slug", topic);
      }
      if (author) {
        query.from("users").where("username", author);
      }
    })

    .then(list => {
      if (list.length !== 0) {
        return true;
      } else return false;
    });
};

checkArticleExists = article_id => {
  return knex
    .select("*")
    .from("articles")
    .where("article_id", article_id)
    .then(list => {
      if (list.length !== 0) {
        return true;
      } else {
        return false;
      }
    });
};

module.exports = {
  checkArticleExists,
  fetchArticleById,
  patchArticle,
  fetchArticles,
  checkAuthorExists
};
