# choopoon

choopoon gets all the defined `routes` or `middlewares` in a given path and adds them to the expressjs app.

## Bug Fixed

There has been a bug with routes/middlewares folder's path in previous versions which led to routes/middlewares not being found by module. The bug is fixed in version 1.0.5;

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

`addRoutes()` and `addMiddlewares()` accept a third optional parameter in which one can define:

- a `selectionFilter` (both)

      choopoon.addRoutes(app, "./pipeline", {selectionFilter: (f) => f.startsWith("route")});

- a `baseUrl` (only `addRoutes()`)

      choopoon.addRoutes(app, "./routes", {baseUrl: "/api/"});

- a `sortFunction` (only `addMiddlewares`)

      If not provided, `Array.sort()` is used by default.

### sorting middlewares

`sortFunction` is used to sort middleware files. For example, by default a file named `auth.js` will be placed before `logging.js`. To change this, one solution is to prefix files with numbers e.g. `0_logging.js` will come before `1_auth.js`.

Note that If a single file includes more than one middleware function, `sortFunction` won't be applied to them and they'll be added to pipeline from top to bottom.

### return value

Both functions return an array of names of `routes` or `middlewares` they have found.
If `./routes` contains `posts.js`, `profile.js` and `admin/posts.js` files then :

    const routes = choopoon.addRoutes(app, "./routes", {baseUrl: "/api/"});
    console.log(routes);
    /* expecting output:
       /api/posts
       /api/profile
       /api/admin/posts
    */
