const ajab = require("ajab");
const choopoon = ajab("./index");
const fs = require("fs");
const path = require("path");

beforeAll(() => {
  fs.mkdirSync("routes");
  fs.mkdirSync("routes/folder");
  writeFile("home.js");
  writeFile("admin.js");
});

afterAll(() => {
  fs.rmdirSync("routes", { recursive: true });
});

function writeFile(name) {
  fs.writeFileSync(`routes/${name}`, "", (err) => {
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
    writeFile("file.txt");

    const result = choopoon.gatherAllFiles("./routes", (f) =>
      f.endsWith(".txt")
    );

    expect(result).not.toEqual(expect.arrayContaining(["./routes/home.js"]));
    expect(result).not.toEqual(expect.arrayContaining(["./routes/admin.js"]));
    expect(result).toEqual(expect.arrayContaining(["./routes/file.txt"]));
  });

  it("should look in subfolders as well", () => {
    fs.mkdirSync("routes/auth");
    writeFile("auth/login.js");

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
});
