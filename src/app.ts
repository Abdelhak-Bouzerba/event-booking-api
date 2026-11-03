import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";


dotenv.config();

const app = express();
app.use(express.json());

//Global error handler middleware
app.use(errorHandler);

export default app;