const users_Router = require("express").Router();
const { getUserById } = require("../controllers/users.controller");
users_Router.route("/:username").get(getUserById);

module.exports = users_Router;
