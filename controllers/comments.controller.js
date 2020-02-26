const { patchComment, deleteComment } = require("../models/comments.models");

const updateComment = (req, res, next) => {
  patchComment(req.params, req.body)
    .then(comment => {
      res.send({ comment });
    })
    .catch(next);
};

const expungeComment = (req, res, next) => {
  deleteComment(req.params)
    .then(boolean => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = { updateComment, expungeComment };
