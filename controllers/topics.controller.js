const { fetchTopics } = require("../models/topics.models");

const getTopics = (req, res, next) => {
  fetchTopics()
    .then(topics => {
      res.send({ topics });
    })
    .catch(err);
};

module.exports = { getTopics };
