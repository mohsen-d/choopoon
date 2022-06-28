const ajab = require("ajab");
const choopoon = ajab("./index");
const fs = require("fs");
const path = require("path");

beforeEach(() => {
  fs.mkdirSync("routes");
  fs.mkdirSync("middlewares");
  fs.mkdirSync("routes/folder");
  writeFile("routes", "home.js");
  writeFile("routes", "admin.js");
  writeFile("middlewares", "logging.js");
  writeFile("middlewares", "auth.js");
});

afterEach(() => {
  fs.rmdirSync("routes", { recursive: true });
  fs.rmdirSync("middlewares", { recursive: true });
});

function writeFile(folderName, fileName) {
  fs.writeFileSync(`${folderName}/${fileName}`, "", (err) => {
    if (err) {
      console.error(err);
    }
  });
}

describe("gatherAllFiles()", () => {
  it("should gather all files in the given folder", () => {
    const result = choopoon.gatherAllFiles("./routes");

    expect(result).toEqual(expect.arrayContaining(["./routes/home.js"]));
    expect(result).toEqual(expect.arrayContaining(["./routes/admin.js"]));
  });

  it("should not return folders", () => {
    const result = choopoon.gatherAllFiles("./routes");
    expect(result).not.toEqual(expect.arrayContaining(["./routes/folder"]));
  });

  it("should filter files if a filter is given", () => {
    writeFile("routes", "file.txt");

    const result = choopoon.gatherAllFiles("./routes", (f) =>
      f.endsWith(".txt")
    );

    expect(result).not.toEqual(expect.arrayContaining(["./routes/home.js"]));
    expect(result).not.toEqual(expect.arrayContaining(["./routes/admin.js"]));
    expect(result).toEqual(expect.arrayContaining(["./routes/file.txt"]));
  });

  it("should look in subfolders as well", () => {
    fs.mkdirSync("routes/auth");
    writeFile("routes", "auth/login.js");

    const result = choopoon.gatherAllFiles("./routes");

    expect(result).toEqual(expect.arrayContaining(["./routes/auth/login.js"]));
  });
});

describe("addRoutes", () => {
  const app = new (function () {
    this.routes = [];
    this.use = function (url, route) {
      this.routes.push({ url: url, route: route });
    };
  })();

  it("should add routes to app", () => {
    // "ajab" has a bug about relative paths so can't use ./routes directly in .addRoutes function
    const routesPath = path.resolve("./routes");
    choopoon.addRoutes(app, routesPath);
    expect(app.routes).toEqual(
      expect.arrayContaining([{ route: {}, url: "/admin" }])
    );
  });

  it("should append baseUrl to routes' urls", () => {
    // "ajab" has a bug about relative paths so can't use ./routes directly in .addRoutes function
    const routesPath = path.resolve("./routes");
    choopoon.addRoutes(app, routesPath, { baseUrl: "/api/" });
    expect(app.routes).toEqual(
      expect.arrayContaining([{ route: {}, url: "/api/admin" }])
    );
  });

  it("should return list of routes found", () => {
    // "ajab" has a bug about relative paths so can't use ./routes directly in .addRoutes function
    const routesPath = path.resolve("./routes");
    const list = choopoon.addRoutes(app, routesPath, { baseUrl: "/api/" });
    expect(list.length).toBe(2);
    expect(list[0]).toBe("/api/admin");
    expect(list[1]).toBe("/api/home");
  });
});

describe("addMiddlewares", () => {
  const app = new (function () {
    this.middlewares = [];
    this.use = function (mw) {
      this.middlewares.push(mw);
    };
  })();

  it("should add middlewares to app's pipeline", () => {
    // "ajab" has a bug about relative paths so can't use ./routes directly in .addRoutes function
    const mwPath = path.resolve("./middlewares");
    choopoon.addMiddlewares(app, mwPath);
    expect(app.middlewares).toEqual(expect.arrayContaining([{}, {}]));
  });

  it("should return list of middlewares found", () => {
    // "ajab" has a bug about relative paths so can't use ./routes directly in .addRoutes function
    const mwPath = path.resolve("./middlewares");
    const list = choopoon.addMiddlewares(app, mwPath);
    expect(list[0]).toBe("auth");
    expect(list[1]).toBe("logging");
  });
});
