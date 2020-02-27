const endpoints = require("../endpoints.json");

const describeAPI = (req, res, next) => {
  res.send(endpoints);
};

module.exports = describeAPI;
