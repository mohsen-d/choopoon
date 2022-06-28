const express = require("express");
const choopoon = require("../../index");

const app = express();

choopoon.addMiddlewares(app, "./tests/integration/middlewares");
choopoon.addRoutes(app, "./tests/integration/routes");

const server = app.listen(3001, () => {
  console.log("listening on port 3001");
});

module.exports = server;
