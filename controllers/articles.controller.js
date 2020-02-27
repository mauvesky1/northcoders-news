const {
  fetchArticleById,
  patchArticle,
  fetchArticles
} = require("../models/articles.models");

const { postComment, fetchCommentsById } = require("../models/comments.models");

const getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      res.send({ article });
    })
    .catch(next);
};

const updateArticle = (req, res, next) => {
  patchArticle(req.params, req.body)
    .then(article => {
      res.send({ article });
    })
    .catch(next);
};

const createComment = (req, res, next) => {
  postComment(req.params, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

const getCommentsById = (req, res, next) => {
  fetchCommentsById(req.params, req.query)
    .then(comments => {
      res.send({ comments });
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
};
module.exports = {
  getArticleById,
  updateArticle,
  createComment,
  getCommentsById,
  getArticles
};