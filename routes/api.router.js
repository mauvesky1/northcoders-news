const api_Router = require("express").Router();
const { topics_Router } = require("./topics.router");

api_Router.use("/topics", topics_Router);

module.exports = api_Router;
