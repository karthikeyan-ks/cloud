import request from "supertest";
import app from "./index";

describe("GET /", () => {
  it("should return a 200 status and the correct message", async () => {

    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello, World! Your Express server is running.");

  });
});