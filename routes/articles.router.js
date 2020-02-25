const articles_Router = require("express").Router();
const {
  getArticleById,
  updateArticle,
  createComment,
  getCommentsById,
  getArticles
} = require("../controllers/articles.controller");

articles_Router.route("/").get(getArticles);
articles_Router
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticle);

articles_Router
  .route("/:article_id/comments")
  .post(createComment)
  .get(getCommentsById);

module.exports = articles_Router;
