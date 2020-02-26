const users_Router = require("express").Router();
const { getUserById } = require("../controllers/users.controller");

const { methodNotAllowed } = require("../errors/errors");

users_Router
  .route("/:username")
  .get(getUserById)
  .all(methodNotAllowed);

module.exports = users_Router;
