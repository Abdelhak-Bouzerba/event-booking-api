import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            }
        }
    }
}

//Generate a JWT access token 
export const generateJwtAccessToken = (payload: {id:string , role:string} ) => { 
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