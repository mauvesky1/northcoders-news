const comments_Router = require("express").Router();
const {
  updateComment,
  expungeComment
} = require("../controllers/comments.controller");

comments_Router
  .route("/:comment_id")
  .patch(updateComment)
  .delete(expungeComment);

module.exports = comments_Router;
