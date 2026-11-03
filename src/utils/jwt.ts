import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: string | jwt.JwtPayload;
        }
    }
}

//Generate a JWT access token 
export const generateJwtAccessToken = (payload: any) => { 
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1d"
    });
    return token;
}

//Verify a JWT token
export const verifyJwtToken = (token: string) => { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
}