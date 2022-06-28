const choopoon = require("../../index");
const request = require("supertest");
let server;

describe("addRoutes()", () => {
  beforeEach(() => {
    server = require("./app");
  });

  afterEach(() => {
    server.close();
  });

  it("should serve /route with success", async () => {
    const res = await request(server).get("/route");
    expect(res.status).toBe(200);
    expect(res.text).toBe("choopoon");
  });
});
