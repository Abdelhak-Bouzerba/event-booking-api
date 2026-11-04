import express from "express";
import userController from "../controllers/auth.controller.js";
import asyncHandler from "express-async-handler";
import { authLimiter } from "../middlewares/limiter.js";

const router = express.Router();

//Register new user
//Route POST api/auth/register
//Access Public
router.post("/register", authLimiter, asyncHandler(userController.registerUser));


//Login user
//Route POST api/auth/login
//Access Public
router.post("/login", authLimiter, asyncHandler(userController.loginUser));

export default router;