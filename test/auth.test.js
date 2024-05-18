import request from "supertest";
import { expect } from "chai";
import bcrypt from "bcryptjs";
import server from "../server.js";
import { User } from "../models/user.model.js";

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(server).post("/api/auth/register").send({
      firstName: "Test",
      lastName: "Test",
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal("User registered successfully");

    const user = await User.findOne({ email: "test@example.com" });
    expect(user).to.exist;
    expect(await bcrypt.compare("password123", user.password)).to.be.true;
  });

  // it("should not register a user with an existing email", async () => {
  //   await new User({
  //     firstName: "Test",
  //     lastName: "Test",
  //     username: "testuser",
  //     email: "test@example.com",
  //     password: "password123",
  //   }).save();

  //   const res = await request(server)
  //     .post("/api/auth/register")
  //     .send({ email: "test@example.com", password: "password123" });

  //   expect(res.status).to.equal(409);
  // });

  // it("should not register a user with an existing username", async () => {
  //   await new User({
  //     firstName: "Test",
  //     lastName: "Test",
  //     username: "testuser",
  //     email: "test@example.com",
  //     password: "password123",
  //   }).save();

  //   const res = await request(server)
  //     .post("/api/auth/register")
  //     .send({ username: "testuser", password: "password123" });

  //   expect(res.status).to.equal(409);
  // });

  // it("should log in a user", async () => {
  //   const user = new User({
  //     email: "test@example.com",
  //     password: await bcrypt.hash("password123", 10),
  //   });
  //   await user.save();

  //   const res = await request(server)
  //     .post("/auth/login")
  //     .send({ email: "test@example.com", password: "password123" });

  //   expect(res.status).to.equal(200);
  //   expect(res.body.token).to.exist;
  // });

  // it("should not log in a user with incorrect password", async () => {
  //   const user = new User({
  //     email: "test@example.com",
  //     password: await bcrypt.hash("password123", 10),
  //   });
  //   await user.save();

  //   const res = await request(server)
  //     .post("/auth/login")
  //     .send({ email: "test@example.com", password: "wrongpassword" });

  //   expect(res.status).to.equal(401);
  // });

  // it("should not log in a user with incorrect password", async () => {
  //   // const user = new User({
  //   //   email: "test@example.com",
  //   //   password: await bcrypt.hash("password123", 10),
  //   // });
  //   // await user.save();

  //   const res = await request(server)
  //     .get("/api/user/profile")
  //     // .send({ email: "test@example.com", password: "wrongpassword" });
  //     .set("Authorization", `Bearer ${token}`);
  //   expect(res.status).to.equal(200);
  // });
});
