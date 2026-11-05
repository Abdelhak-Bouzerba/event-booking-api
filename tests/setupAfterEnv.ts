import sequelize from "../src/config/db";
import cleanupdatabase from "./helpers/cleanup";

beforeAll(async () => {
  await sequelize.authenticate();
  console.log("Database connection established successfully.");
});

beforeEach(async () => {
  await cleanupdatabase();
});

afterAll(async () => {
  await sequelize.close();
  console.log("Database connection closed.");
});