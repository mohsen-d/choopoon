# choopoon

choopoon gets all the defined `routes` or `middlewares` in a given path and adds them to the expressjs app.

## installing

to install run `npm i choopoon` in terminal

## using

choopoon offers 2 methods:

    addRoutes(app, path, options);

    addMiddlewares(app, path, options);

For example, if you save your routes in a folder named `routes`, the code below adds automatically all the routes to your app:

    const express = require("express");
    const choopoon = require("choopoon");

    const app = express();

    choopoon.addRoutes(app, "./routes");

`addRoutes()` accepts an optional third parameter in which one can define:

- a `selectionFunction`

      choopoon.addRoutes(app, "./pipeline", {selectionFunction: (f) => f.startsWith("route")});

- a `baseUrl`

      choopoon.addRoutes(app, "./routes", {baseUrl: "/api/"});

`addMiddlewares()` third parameter accepts `selectionFunction` and `sortFunction`. By default it uses `Array.sort()` if a `sortFunction` is not provided.

Both functions return an array of `routes` or `middlewares` they have found.

    const routes = choopoon.addRoutes(app, "./routes");
