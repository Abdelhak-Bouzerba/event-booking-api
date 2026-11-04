import express from "express";
import userController from "../controllers/auth.controller.js";
import asyncHandler from "express-async-handler";


const router = express.Router();

//Register new user
//Route POST api/auth/register
//Access Public
router.post("/register", asyncHandler(userController.registerUser));


//Login user
//Route POST api/auth/login
//Access Public
router.post("/login" , asyncHandler(userController.loginUser));

export default router;