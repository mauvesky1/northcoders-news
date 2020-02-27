const articles_Router = require("express").Router();
const {
  getArticleById,
  updateArticle,
  createComment,
  getCommentsById,
  getArticles,
  sendArticle
} = require("../controllers/articles.controller");

const { methodNotAllowed } = require("../errors/errors");

articles_Router
  .route("/")
  .get(getArticles)
  .post(sendArticle)
  .all(methodNotAllowed);
articles_Router
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticle)
  .all(methodNotAllowed);

articles_Router
  .route("/:article_id/comments")
  .post(createComment)
  .get(getCommentsById)
  .all(methodNotAllowed);

module.exports = articles_Router;
