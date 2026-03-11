import { Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const publicRoutes = [
    '/auth/login',
    '/register',
    '/'
]

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(`${req.path}`)
    if (publicRoutes.includes(req.path)) 
        return next();

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({
        message:'Token missing',
        error: true
    })
    const token = authHeader.split(" ")[1]
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch(err) {
        return res.status(403).json({
            message: 'Invalid or expired token'
        })
    }
}