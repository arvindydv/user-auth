import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { before, after, beforeEach } from "mocha";

let mongoServer;

before(async function () {
  this.timeout(20000); // Increase timeout for setup
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.log(uri, "111")

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async function () {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async function () {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});
