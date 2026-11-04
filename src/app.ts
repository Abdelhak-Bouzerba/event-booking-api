import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();

//Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: "*",
}));

//Routes
app.use("/api/auth", userRoutes);

//Global error handling middleware
app.use(errorHandler);

export default app;