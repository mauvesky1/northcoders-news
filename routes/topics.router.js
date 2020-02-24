const topics_Router = require("express").Router();
const { getTopics } = require("../controllers/topics.controller");

topics_Router.route("/").get(getTopics);

module.exports = { topics_Router };
