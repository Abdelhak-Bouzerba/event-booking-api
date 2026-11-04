import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/events.route.js";

dotenv.config();

const app = express();

//Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: "*",
}));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

//Global error handling middleware
app.use(errorHandler);

export default app;