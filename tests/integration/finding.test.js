const choopoon = require("../../index");

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
    choopoon.addRoutes(app, "./routes");
    expect(app.routes.length).toBe(2);
    expect(app.routes[0].url).toBe("/admin/route");
    expect(app.routes[1].url).toBe("/route");
  });

  it("should append baseUrl to routes' urls", () => {
    choopoon.addRoutes(app, "./routes", { baseUrl: "/api/" });
    expect(app.routes.length).toBe(2);
    expect(app.routes[0].url).toBe("/api/admin/route");
    expect(app.routes[1].url).toBe("/api/route");
  });

  it("should return list of routes found", () => {
    const list = choopoon.addRoutes(app, "./routes", {
      baseUrl: "/api/",
    });
    expect(list.length).toBe(2);
    expect(list[0]).toBe("/api/admin/route");
    expect(list[1]).toBe("/api/route");
  });
});

describe("addMiddlewares() findind middlewares", () => {
  let app;

  beforeEach(() => {
    app = new (function () {
      this.middlewares = [];
      this.use = function (mw) {
        this.middlewares.push(mw);
      };
    })();
  });

  it("should add middlewares to app's pipeline", () => {
    choopoon.addMiddlewares(app, "./middlewares");
    expect(app.middlewares.length).toBe(5);
  });

  it("should return list of middlewares found", () => {
    const list = choopoon.addMiddlewares(app, "./middlewares");
    expect(list[0]).toBe("0_middleware");
    expect(list[1]).toBe("1_middleware");
    expect(list[2]).toBe("thirdMiddleware");
    expect(list[3]).toBe("forthMiddleware");
  });
});
