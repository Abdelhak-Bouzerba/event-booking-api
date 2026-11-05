import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/events.route.js";
import userRoutes from "./routes/user.route.js";
import { apiLimiter } from "./middlewares/limiter.js";

const app = express();

//Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
    origin: "*",
}));

//Routes
app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

//Global error handling middleware
app.use(errorHandler);

export default app;