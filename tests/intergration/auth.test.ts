import request from "supertest";
import app from "../../src/app";
import createUser from "../factories/user.factory";

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "test",
      email: "test@gmail.com",
      password: "test-password-hash",
      role: "attendee",
    });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data.user).not.toHaveProperty("passwordHash");
  });

  it("should login an existing user", async () => {
    await request(app).post("/api/auth/register").send({
      name: "test",
      email: "login-test@gmail.com",
      password: "test-password-hash",
      role: "attendee",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login-test@gmail.com",
      password: "test-password-hash",
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("should return 400 for Invalid login credentials", async () => {
        const user = await createUser({
          name: "test",
          email: "test@gmail.com",
          passwordHash: "test-password-hash",
          role: "attendee",
        });

        const login = await request(app).post("/api/auth/login").send({
            email: "test@gmail.com",
            password: "wrong-password"
        });

        expect(login.status).toBe(400);
        expect(login.body).toHaveProperty("error");
        expect(login.body.error.code).toBe("INVALID_CREDENTIALS");
    });
});
