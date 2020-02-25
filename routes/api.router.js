const api_Router = require("express").Router();
const { topics_Router } = require("./topics.router");
const users_Router = require("./users.router");
const articles_Router = require("./articles.router");

api_Router.use("/topics", topics_Router);
api_Router.use("/users", users_Router);
api_Router.use("/articles", articles_Router);

module.exports = api_Router;
