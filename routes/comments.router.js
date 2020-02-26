const comments_Router = require("express").Router();
const {
  updateComment,
  expungeComment
} = require("../controllers/comments.controller");
const { methodNotAllowed } = require("../errors/errors");

comments_Router
  .route("/:comment_id")
  .patch(updateComment)
  .delete(expungeComment)
  .all(methodNotAllowed);

module.exports = comments_Router;
