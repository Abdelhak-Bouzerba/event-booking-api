import authRepository from "../repositories/auth.repository.js";
import { registerUserSchema, RegisterUserSchemaType , loginUserSchema , LoginUserSchemaType } from "../validators/auth.validator.js";
import { ApiError } from "../middlewares/errorHandler.js";
import bcrypt from "bcrypt";
import { generateJwtAccessToken } from "../utils/jwt.js";


//Register a new user service
const registerUser = async (userData: RegisterUserSchemaType) => {

    //Validate input
    const parseResult = registerUserSchema.safeParse(userData);
    if (!parseResult.success) {
        throw new ApiError(parseResult.error.message, 400, "INVALID_INPUT");
    }
    const data = parseResult.data;

    //check if user already exists
    const existingUser = await authRepository.checkUserExists(data.email);
    if (existingUser) {
        throw new ApiError("User already exists", 400, "USER_EXISTS");
    }

    //Hash the password
    const passwordHash = await bcrypt.hash(data.password, 10);

    //register the new user
    const newUser = await authRepository.registerUser({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    });

    //Generate jwt access token
    const accessToken = generateJwtAccessToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
    });

    //return needed data
    return {
        user: newUser,
        accessToken
    }
};

//Login a user Service
const loginUser = async (loginData: LoginUserSchemaType) => {

    //Validate input
    const parseResult = loginUserSchema.safeParse(loginData);
    if (!parseResult.success) {
        throw new ApiError(parseResult.error.message, 400, "INVALID_INPUT");
    }
    const data = parseResult.data;

    //check if user exists
    const existingUser = await authRepository.checkUserExists(data.email);
    if (!existingUser) { 
        throw new ApiError("invalid email or password", 400, "INVALID_CREDENTIALS");
    }

    //Compare password
    const passwordMatch = await bcrypt.compare(data.password, existingUser.passwordHash);
    if(!passwordMatch) {
        throw new ApiError("invalid email or password", 400, "INVALID_CREDENTIALS");
    }

    //Generate jwt access token
    const accessToken = generateJwtAccessToken({
        id: existingUser.id,
        email: data.email,
        role: existingUser.role
    });

    //return needed data
    return accessToken;

};

export default {
  registerUser,
  loginUser,
};