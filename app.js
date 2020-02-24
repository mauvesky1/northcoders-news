const express = require("express");
// cosnt api_Router = require()

const app = express();

const api_Router = require("./routes/api.router");

app.use(express.json());

app.use("/api", api_Router);

module.exports = app;
