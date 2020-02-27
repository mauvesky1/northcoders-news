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
  topic,
  limit = 10,
  offset = 0
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
      if (result.length === 0 && author && topic) {
        return Promise.all([
          result,
          checkExists({ author }),
          checkExists(
            { topic },
            total_count("topic", topic, 0),
            total_count("articles", 0, author)
          )
        ]);
      } else if (result.length === 0 && topic) {
        return Promise.all([
          result,
          true,
          checkExists({ topic }),
          total_count("articles", topic, author)
        ]);
      } else if (result.length === 0 && author) {
        return Promise.all([
          result,
          checkExists({ author }),
          true,
          total_count("articles", topic, author)
        ]);
      } else {
        return Promise.all([
          result,
          true,
          true,
          total_count("articles", topic, author)
        ]);
      }
    })
    .then(
      ([result, checkAuthor, checkTopic, totalCount, totalCountMSearch]) => {
        console.log(totalCount, checkAuthor, checkTopic);
        if (totalCountMSearch) {
          if (totalCountMSearch < totalCount) {
            totalCount = totalCountMSearch;
          }
        }
        console.log(totalCount, "totalCount", result.length, "result length");
        if (checkAuthor === true && checkTopic === true) {
          return result;
        } else {
          return Promise.reject({ status: 404, msg: "Nothing found" });
        }
      }
    );
};

checkExists = ({ topic, author, article_id }) => {
  return knex
    .select("*")
    .modify(query => {
      if (topic) {
        query.from("topics").where("slug", topic);
      }
      if (author) {
        query.from("users").where("username", author);
      }
      if (article_id) {
        query.from("articles").where("article_id", article_id);
      }
    })

    .then(list => {
      if (list.length !== 0) {
        return true;
      } else return false;
    });
};
total_count = (table, topic, author) => {
  return knex
    .select("*")
    .from("articles")
    .modify(query => {
      if (author) {
        console.log("in the author");
        query.where("articles.author", author);
      }
      if (topic) {
        console.log("in the topic");
        query.where("articles.topic", topic);
      }
    })
    .then(result => {
      return result.length;
    });
};

module.exports = {
  fetchArticleById,
  patchArticle,
  fetchArticles,
  checkExists
};
