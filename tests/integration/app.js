const express = require("express");
const choopoon = require("../../index");

const app = express();

choopoon.addMiddlewares(app, "./middlewares");
choopoon.addRoutes(app, "./routes");

const server = app.listen(3010, () => {
  console.log("listening on port 3010");
});

module.exports = server;
