import mongoose from "mongoose";
import request from "supertest";

import app from "../server.js";
import { User } from "../models/user.model.js";

describe("Auth API", () => {
  beforeAll(async () => {
    jest.setTimeout(15000);

    await mongoose.connect(
      "mongodb+srv://arvindydv03:kMLBbG2TYA6hbDkt@cluster0.r9mv9rc.mongodb.net/testdb",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  // register user test cases
  describe("POST /api/auth/register", () => {
    it("should register a user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "123456",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe("User registered successfully");
    });

    it("should not register a user with the same email or username", async () => {
      const user = new User({
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "123456",
      });
      await user.save();

      const res = await request(app).post("/api/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "123456",
      });

      expect(res.statusCode).toEqual(409);
      expect(res.body.message).toBe("Email or Username is already in use");
    });

    it("should not register a user without email, password or username", async () => {
      const res = await request(app).post("/api/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "123456",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("All fields are required");
    });

    it("should not register a user with invalid email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "johnexample.com",
        password: "123456",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Enter a valid email address");
    });
  });

  // user login test cases
  describe("POST /api/auth/login", () => {
    it("should login a user", async () => {
      const user = new User({
        firstName: "John",
        lastName: "Doe",
        username: "johndoe1",
        email: "john1@example.com",
        password: "John123",
      });
      await user.save();

      // console.log(user, "uuuu");

      const res = await request(app).post("/api/auth/login").send({
        email: "john1@example.com",
        password: "John123",
      });

      // console.log(res, "uuuu");

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe("User logged in successfully");
    });

    it("should not login with invalid email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "invalid@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe("User not found");
    });

    it("should not login with invalid Password", async () => {
      const user = new User({
        firstName: "John",
        lastName: "Doe",
        username: "johndoe1",
        email: "john1@example.com",
        password: "John123",
      });
      await user.save();
      const res = await request(app).post("/api/auth/login").send({
        email: "john1@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe("Invalid password");
    });

    it("should not login without email or password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john1@example.com",
        password: "",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe(
        "Email/username and Password both are required"
      );
    });
  });

  // get user profile test cases
  describe("GET /api/user/profile", () => {
    it("should get user profile", async () => {
      const user = new User({
        firstName: "John",
        lastName: "Doe",
        username: "johndoe1",
        email: "john1@example.com",
        password: "John123",
      });
      await user.save();

      const loginRes = await request(app).post("/api/auth/login").send({
        email: "john1@example.com",
        password: "John123",
      });

      const token = loginRes.body.accessToken;
      console.log(token, "tttt");

      const profileRes = await request(app)
        .get("/api/user/profile")
        .set("Authorization", `Bearer${token}`);

      expect(profileRes.statusCode).toEqual(200);
      expect(profileRes.body).toHaveProperty("email", "john1@example.com");
      expect(profileRes.body).toHaveProperty("firstName", "John");
      expect(profileRes.body).toHaveProperty("lastName", "Doe");
      expect(profileRes.body).toHaveProperty("username", "johndoe1");
    });

    it("should not get profile without token", async () => {
      const res = await request(app).get("/api/user/profile");

      expect(res.statusCode).toEqual(401);
      // expect(res.body.message).toBe('No token, authorization denied');
    });

    it("should not get profile with invalid token", async () => {
      const res = await request(app)
        .get("/api/user/profile")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.statusCode).toEqual(401);
      // expect(res.body.message).toBe('Token is not valid');
    });
  });
});
