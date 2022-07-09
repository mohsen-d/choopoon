const fs = require("fs");
const path = require("path");

function gatherAllFiles(folderPath, selectionFilter) {
  let files = [];

  const fullPath = path.resolve(require.main.path, folderPath);

  const isFile = (f) => {
    const filePath = fullPath + "\\" + f;
    return fs.lstatSync(filePath).isFile();
  };

  let folderContent = fs.readdirSync(fullPath);

  for (const f of folderContent) {
    if (isFile(f)) {
      files.push(folderPath + "/" + f);
    } else {
      const subFolderFiles = gatherAllFiles(
        folderPath + "/" + f,
        selectionFilter
      );
      if (subFolderFiles.length > 0) files.push(subFolderFiles);
    }
  }

  if (selectionFilter) files = files.filter(selectionFilter);

  return files.flat();
}

module.exports.addRoutes = function (app, routesPath, options = {}) {
  const routesFiles = gatherAllFiles(routesPath, options.selectionFilter);
  const routesUrls = [];
  const baseUrl = options.baseUrl ? options.baseUrl : "/";
  for (const routeFile of routesFiles) {
    const routeUrl = makeRouteUrl(baseUrl, routesPath, routeFile);

    const route = require.main.require(routeFile);
    app.use(routeUrl, route);

    routesUrls.push(routeUrl);
  }

  return routesUrls;
};

module.exports.addMiddlewares = function (app, filesPath, options = {}) {
  const middlewaresFiles = gatherAllFiles(filesPath, options.selectionFilter);
  const middlewares = [];

  if (options.sortFunction) middlewaresFiles.sort(options.sortFunction);
  else middlewaresFiles.sort();

  for (const middlewareFile of middlewaresFiles) {
    const moduleExports = require.main.require(middlewareFile);

    if (typeof moduleExports === "function") {
      app.use(moduleExports);
      middlewares.push(path.basename(middlewareFile, ".js"));
    } else if (typeof moduleExports === "object") {
      for (const middlewareName of Object.keys(moduleExports)) {
        app.use(moduleExports[middlewareName]);
        middlewares.push(middlewareName);
      }
    }
  }

  return middlewares;
};

module.exports.addTo = function (filesPath, callback, options = {}) {
  const files = gatherAllFiles(filesPath, options.selectionFilter);
  const output = [];

  if (options.sortFunction) files.sort(options.sortFunction);
  else files.sort();

  for (const file of files) {
    const moduleExports = require.main.require(file);

    if (typeof moduleExports === "function") {
      callback(moduleExports);
      output.push(path.basename(file));
    } else if (typeof moduleExports === "object") {
      for (const key of Object.keys(moduleExports)) {
        callback(moduleExports[key]);
        output.push(key);
      }
    }
  }

  return output;
};

function makeRouteUrl(baseUrl, routesPath, routeFile) {
  const fileName = path.basename(routeFile, ".js");
  const fileUrl = path.dirname(routeFile).replace(routesPath, "");
  return path.posix.join(baseUrl, fileUrl, fileName);
}
