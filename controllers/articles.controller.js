const { fetchArticleById } = require("../models/articles.models");

const getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then(article => {
      res.send(article);
    })
    .catch(next);
};

module.exports = { getArticleById };
