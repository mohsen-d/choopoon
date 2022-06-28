const express = require("express");
const choopoon = require("../../index");

const app = express();

choopoon.addRoutes(app, "./tests/integration/routes");

const server = app.listen(3000, () => {
  console.log("listening on port 3000");
});

module.exports = server;
