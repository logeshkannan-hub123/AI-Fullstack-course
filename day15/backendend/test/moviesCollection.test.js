import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "../../app.js";
import { connectDB, disconnectDB } from "../../database.js";

dotenv.config();

let token = "";

beforeAll(async () => {
  await connectDB();

  const login = await request(app).post("/login").send({
    email: process.env.USER_EMAIL,
    password: process.env.USER_PASSWORD,
  });

  expect(login.status).toBe(200);

  token = login.body.token;
}, 20000);

afterAll(async () => {
  await disconnectDB();
});

describe("POST /login", () => {
  test("should login successfully", () => {
    expect(token).toBeDefined();
  });
});

describe("GET /movies", () => {
  test("should return all movies", async () => {
    const res = await request(app)
      .get("/movies")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
