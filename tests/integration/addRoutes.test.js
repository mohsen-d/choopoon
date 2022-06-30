const choopoon = require("../../index");
const request = require("supertest");
let server;

describe("addRoutes() serving requests", () => {
  beforeEach(() => {
    server = require("./app");
  });

  afterEach(() => {
    server.close();
  });

  it("should serve /route with success", async () => {
    const res = await request(server).get("/route/testingroutes");
    expect(res.status).toBe(200);
    expect(res.text).toBe("choopoon");
  });
});

describe("addRoutes() finding routes", () => {
  let app;

  beforeEach(() => {
    app = new (function () {
      this.routes = [];
      this.use = function (url, route) {
        this.routes.push({ url: url, route: route });
      };
    })();
  });

  it("should add routes to app", () => {
    choopoon.addRoutes(app, "./tests/integration/routes");
    expect(app.routes.length).toBe(1);
    expect(app.routes[0].url).toBe("/route");
  });

  it("should append baseUrl to routes' urls", () => {
    choopoon.addRoutes(app, "./tests/integration/routes", { baseUrl: "/api/" });
    expect(app.routes.length).toBe(1);
    expect(app.routes[0].url).toBe("/api/route");
  });

  it("should return list of routes found", () => {
    const list = choopoon.addRoutes(app, "./tests/integration/routes", {
      baseUrl: "/api/",
    });
    expect(list.length).toBe(1);
    expect(list[0]).toBe("/api/route");
  });
});
