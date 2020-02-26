const express = require("express");

const app = express();

const api_Router = require("./routes/api.router");
const {
  notFoundHandler,
  handlePSQLErrors,
  handleCustomErrors
} = require("./errors/errors");

app.use(express.json());

app.use("/api", api_Router);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use("/*", notFoundHandler);

module.exports = app;
