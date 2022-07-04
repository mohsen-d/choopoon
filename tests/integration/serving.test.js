const choopoon = require("../../index");
const request = require("supertest");
let server;

beforeAll(() => {
  server = require("./app");
});

afterAll(() => {
  server.close();
});

describe("addRoutes() serving requests", () => {
  it("should serve /route with success", async () => {
    const res = await request(server).get("/route/testingroutes");
    expect(res.status).toBe(200);
    expect(res.text).toBe("choopoon");
  });
});

describe("addMiddlewares() serving requests", () => {
  it("should block the request", async () => {
    const res = await request(server).get("/route/testingmiddlewares");
    expect(res.status).toBe(403);
    expect(res.text).toBe("blocked by middleware");
  });

  it("should sort (A->Z) then add middlewares", async () => {
    const res = await request(server).get("/route/sorting");
    expect(res.status).toBe(200);
    expect(res.text).toBe("first second third forth");
  });
});
