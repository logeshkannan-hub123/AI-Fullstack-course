import request from "supertest";
import app from "../app.js";
import User from "../userModel.js";
import {
  connect,
  closeDatabase,
  clearDatabase,
} from "../test-units/db-handler.js";

beforeAll(async () => {
  await connect();
  await User.init(); // ensures unique indexes (email/username)
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe("POST /signup", () => {
  it("creates a new user", async () => {
    const res = await request(app).post("/signup").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
  });
});
