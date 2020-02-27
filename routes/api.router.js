const api_Router = require("express").Router();
const topics_Router = require("./topics.router");
const users_Router = require("./users.router");
const articles_Router = require("./articles.router");
const comments_Router = require("./comments.router");

const describeAPI = require("../controllers/api.controller");

const { methodNotAllowed } = require("../errors/errors");

api_Router.use("/topics", topics_Router);
api_Router.use("/users", users_Router);
api_Router.use("/articles", articles_Router);
api_Router.use("/comments", comments_Router);
api_Router
  .route("/")
  .get(describeAPI)
  .all(methodNotAllowed);

module.exports = api_Router;
