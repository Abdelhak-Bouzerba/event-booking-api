import app from "./app.js";
import "./models/index.js";
import sequelize from "./config/db.js";
import dotenv from "dotenv";
dotenv.config({quiet: true});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database established successfully🟢");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Application startup failed:", error);
    process.exit(1);
  }
};

startServer();
