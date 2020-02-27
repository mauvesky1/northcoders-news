const endpoints = require("../endpoints.json");

const describeAPI = (req, res, next) => {
  console.log(endpoints);
  res.send(endpoints);
};

// "/api: this URL endpoint brings you to this description of this API. /topics: this endpoint returns with a list of all topics. /users/:username this endpoint returns a single user with the matching username. /articles/:article_id: returns a single article with the matching article id. This is also the endpoint that updates the vote count. /api/articles/:article_id/comments: Returns to the user a list of comments associated with the matching article, which can be ordered as the user wishes. This is also the endpoint associated with sending a new comment to the website. /api/articles: Will respond with a list of all articles, the list can be sorted. Articles can be filtered by topic and author. /api/comments/:comment_id: Allows the user to update the number of votes a particular comment has, as well as to delete a comment."

module.exports = describeAPI;
