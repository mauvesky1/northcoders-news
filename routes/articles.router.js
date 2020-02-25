const articles_Router = require("express").Router();
const { getArticleById } = require("../controllers/articles.controller");

articles_Router.route("/:article_id").get(getArticleById);

module.exports = articles_Router;
