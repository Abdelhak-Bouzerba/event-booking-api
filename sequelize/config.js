import dotenv from "dotenv";
dotenv.config();

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  dialect: "mysql",
};
export default {
  development: {
    ...common,
    logging: console.log,
  },

  test: {
    ...common,
    logging: false,
  },

  production: {
    ...common,
    logging: false,
  },
};
