const choopoon = require("../../index");
const request = require("supertest");
let server;

beforeEach(() => {
  server = require("./app");
});

afterEach(() => {
  server.close();
});

describe("addRoutes()", () => {
  it("should serve /route with success", async () => {
    const res = await request(server).get("/route/testingroutes");
    expect(res.status).toBe(200);
    expect(res.text).toBe("choopoon");
  });
});

describe("addMiddlewares()", () => {
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
