const api_Router = require("express").Router();

api_Router.route("/topics").get(getTopics);

module.exports = api_Router;
