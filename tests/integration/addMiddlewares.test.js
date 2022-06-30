const choopoon = require("../../index");
const request = require("supertest");
let server;

describe("addMiddlewares() serving requests", () => {
  beforeEach(() => {
    server = require("./app");
  });

  afterEach(() => {
    server.close();
  });

  it("should block the request", async () => {
    const res = await request(server).get("/route/testingmiddlewares");
    expect(res.status).toBe(403);
    expect(res.text).toBe("blocked by middleware");
  });

  it("should sort then add middlewares", async () => {
    const res = await request(server).get("/route/sorting");
    expect(res.status).toBe(200);
    expect(res.text).toBe("first second");
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
    choopoon.addMiddlewares(app, "./tests/integration/middlewares");
    expect(app.middlewares.length).toBe(3);
  });

  it("should return list of middlewares found", () => {
    const list = choopoon.addMiddlewares(
      app,
      "./tests/integration/middlewares"
    );
    expect(list[0]).toBe("0_middleware");
    expect(list[1]).toBe("1_middleware");
    expect(list[2]).toBe("middleware");
  });
});
