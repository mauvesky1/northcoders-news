const describeAPI = (req, res, next) => {
  res.send({
    descriptionOfAPI:
      "/Topics: this endpoint returns with a list of all topics. /users/:username this endpoint returns a single user with the matching username "
  });
};

module.exports = describeAPI;
