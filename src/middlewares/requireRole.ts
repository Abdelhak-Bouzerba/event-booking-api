import { Request, Response, NextFunction } from "express";

export const requireRole = (role: string) => { 
    return (req: Request, res: Response, next: NextFunction) => { 
        if (!req.user) { 
            res.status(401).json({
                code: "UNAUTHORIZED",
                message: "you are not authorized to access this resource"
            });
            return;
        }
        if (req.user.role !== role) { 
            res.status(403).json({
                code: "FORBIDDEN",
                message: "You do not have permission to access this resource"
            });
            return;
        }
        next();
    }
}