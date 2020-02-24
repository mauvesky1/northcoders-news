const express = require("express");
// cosnt api_Router = require()

const app = express();

app.use(express.json());

app.use("/api", api_router);

module.exports = app;
