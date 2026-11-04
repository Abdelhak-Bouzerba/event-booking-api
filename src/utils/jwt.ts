import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                role: string;
            }
        }
    }
}
 interface Paylaod {
   email: string;
   role: string;
 }

//Generate a JWT access token 
export const generateJwtAccessToken = (payload: Paylaod) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
};

//Verify a JWT token
export const verifyJwtToken = (token: string) => { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as Paylaod;
    return decoded;
}