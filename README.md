# choopoon

choopoon helps not to manually importing and adding multiple files (routes, middlewares or ...) into your application.

## Bug Fixed

There has been a bug with routes/middlewares folder's path in previous versions which led to routes/middlewares not being found by module. The bug is fixed in version 1.0.5;

## installing

to install run `npm i choopoon` in terminal

## using

choopoon offers 3 methods:

    addRoutes(app, path, options);

    addMiddlewares(app, path, options);

    addTo(path, callback, options);

For example, if you save your routes in a folder named `routes`, the code below adds automatically all the routes to your app:

    const express = require("express");
    const choopoon = require("choopoon");

    const app = express();

    choopoon.addRoutes(app, "./routes");

All the methods accept a third optional parameter in which one can define:

- a `selectionFilter` (all)

      choopoon.addRoutes(app, "./pipeline", {selectionFilter: (f) => f.startsWith("route")});

- a `baseUrl` (only `addRoutes()`)

      choopoon.addRoutes(app, "./routes", {baseUrl: "/api/"});

- a `sortFunction` (`addMiddlewares` and `addTo`)

      If not provided, `Array.sort()` is used by default.

### sorting

`sortFunction` is used to sort files found. For example, by default a file named `auth.js` will be placed before `logging.js`. To change this, one solution is to prefix files with numbers e.g. `0_logging.js` will come before `1_auth.js`.

Note that If `module.exports` is an object, `sortFunction` won't be applied to exported objects and they'll be handled from top to bottom.

### return value

All functions return an array of names of `routes`, `middlewares` or `files` they have found.
If `./routes` contains `posts.js`, `profile.js` and `admin/posts.js` files then :

    const routes = choopoon.addRoutes(app, "./routes", {baseUrl: "/api/"});
    console.log(routes);
    /* expecting output:
       /api/posts
       /api/profile
       /api/admin/posts
    */

## addTo example

Imagine there is a main module:

    const math = {};

    module.exports = math;

but implementing its methods such as `sum` or `sub` shall be done later by others.
choopoon allows developers to implement methods in seperate files without manipulating the main madule.
They can put files in a certain folder, say `methods`.

for example, `sum.js` :

    module.exports = function(){
      return {
            sum: (a, b) => a + b;
      }
    }

or `sub.js`:

    module.exports = function(){
      return {
            sub: (a, b) => a - b;
      }
    }

Then all we need to do is to have main module to find and get all the files and import the methods:

    const choopoon = require("choopoon");

    const math = {};

    choopoon.addTo("./methods", f => {
      const methods = f();
      Object.keys(methods).forEach(m => math[m] = methods[m]);
    });

    module.exports = math;
