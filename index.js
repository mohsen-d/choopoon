const fs = require("fs");
const path = require("path");

function gatherAllFiles(folderPath, selectionFilter) {
  let files = [];

  const fullPath = path.resolve(folderPath);

  const isFile = (f) => {
    const filePath = fullPath + "\\" + f;
    return fs.lstatSync(filePath).isFile();
  };

  let folderContent = fs.readdirSync(fullPath);

  for (const f of folderContent)
    if (isFile(f)) files.push(folderPath + "/" + f);
    else {
      const subFolderFiles = gatherAllFiles(
        folderPath + "/" + f,
        selectionFilter
      );
      if (subFolderFiles.length > 0) files.push(subFolderFiles);
    }

  if (selectionFilter) files = files.filter(selectionFilter);

  return files.flat();
}

module.exports.addRoutes = function (app, routesPath, options = {}) {
  const routesFiles = gatherAllFiles(routesPath, options.selectionFilter);
  const routesUrls = [];
  const baseUrl = options.baseUrl ? options.baseUrl : "/";
  for (const routeFile of routesFiles) {
    const routeUrl = baseUrl + path.basename(routeFile, ".js");
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
    const middleware = require.main.require(middlewareFile);
    app.use(middleware);
    middlewares.push(path.basename(middlewareFile, ".js"));
  }

  return middlewares;
};
