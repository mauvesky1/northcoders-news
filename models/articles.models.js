const knex = require("../db/connection");

postArticle = ({ author, title, topic, body, created_at }) => {
  if (!author || !title || !topic || !body || !created_at)
    return Promise.reject({ status: 400, msg: "Missing information" });
  return knex
    .insert({ author, title, topic, body, created_at })
    .into("articles")
    .returning("*")
    .then(result => {
      return result[0];
    });
};

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
  topic,
  limit = 10,
  p = 0
}) => {
  if (order_by !== "asc" && order_by !== "desc") {
    order_by = "desc";
  }

  if (isNaN(limit)) {
    limit = 10;
  }
  if (isNaN(p)) {
    p = 0;
  }
  let offset = limit * p - limit;
  if (p === 1 || p === 0) {
    offset = 0;
  }

  return knex
    .select("articles.*")
    .from("articles")
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .limit(limit)
    .offset(offset)

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

      return Promise.all([
        result,
        checkExists("users", "username", author),
        checkExists("topics", "slug", topic),
        totalCount("articles", topic, author)
      ]);
    })
    .then(([articles, checkAuthor, checkTopic, total_count]) => {
      if (checkAuthor === true && checkTopic === true) {
        return { articles, total_count };
      } else {
        return Promise.reject({ status: 404, msg: "Nothing found" });
      }
    });
};

checkExists = (table, field, value) => {
  if (value === undefined) {
    return true;
  }
  return knex
    .select("*")
    .modify(query => {
      if (value) {
        query.from(table).where(field, value);
      }
      if (value) {
        query.from(table).where(field, value);
      }
    })

    .then(list => {
      if (list.length !== 0) {
        return true;
      } else return false;
    });
};
totalCount = (table, topic, author) => {
  return knex
    .select("*")
    .from("articles")
    .modify(query => {
      if (author) {
        query.where("articles.author", author);
      }
      if (topic) {
        query.where("articles.topic", topic);
      }
    })
    .then(result => {
      return result.length;
    });
};

module.exports = {
  postArticle,
  fetchArticleById,
  patchArticle,
  fetchArticles,
  checkExists
};
