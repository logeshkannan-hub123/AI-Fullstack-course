import request from "supertest";
import app from "../server.js";
import dotenv from "dotenv";

dotenv.config();

let authToken = "";

describe("GET /movies", () => {
  beforeAll(async () => {
    const res = await request(app).post("/login").send({
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();

    authToken = res.body.token;
  });

  it("logs in and returns a token", () => {
    expect(authToken).toBeDefined();
  });

  it("fetches movies for the logged-in user", async () => {
    const res = await request(app)
      .get("/movies")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
