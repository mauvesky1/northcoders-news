const { fetchUserById } = require("../models/users.models");

const getUserById = (req, res, next) => {
  fetchUserById(req.params)
    .then(user => {
      res.send({ user });
    })
    .catch(err => {
      next(err);
    });
};

module.exports = { getUserById };
