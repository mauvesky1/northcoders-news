const topics_Router = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");
const { methodNotAllowed } = require("../errors/errors");

topics_Router
  .route("/")
  .get(getTopics)
  .all(methodNotAllowed);

module.exports = topics_Router;
