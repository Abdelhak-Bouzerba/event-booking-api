import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({quiet: true});

const isTest = process.env.NODE_ENV === "test";

const sequelize = new Sequelize(
  isTest ? process.env.TEST_DB_NAME! : process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? 3306),
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  },
);

export default sequelize;
