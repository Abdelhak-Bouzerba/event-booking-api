import { Request, Response } from "express";
import userService from "../services/auth.service.js";
import { ApiError } from "../middlewares/errorHandler.js";


//Register new user Controller
const registerUser = async (req: Request, res: Response) => {
    const userData = req.body;

    //check if userData provided
    if (!userData) {
        throw new ApiError("all data are required", 400, "INVALID_INPUT");
    }

    //Call register user service
    const { user, accessToken } = await userService.registerUser(userData);

    //send response
    res.status(201).json({
        user,
        accessToken
    });

};

//Login user Controller
const loginUser = async (req: Request, res: Response) => { 
    const { email, password } = req.body;

    //check if email and password provided
    if (!email || !password) {
        throw new ApiError("Email and password are required", 400, "INVALID_INPUT");
    }

    //Call login user service
    const accessToken = await userService.loginUser({ email, password });

    //send response
    res.status(200).json({
        accessToken
    });
    
};

export default {
    registerUser,
    loginUser,
}