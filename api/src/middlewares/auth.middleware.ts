import rateLimit from 'express-rate-limit';
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        username: string;
    } 
}

interface CustomJwtPayload extends JwtPayload {
    id: string;
    email: string;
    username: string;
}

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { error: 'Terlalu banyak permintaan login/register dari IP ini.' },
});

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access token is missing' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY || 'jwt-token', (err, decoded) => {
        if (err) {
            res.status(403).json({ message: 'Invalid access token' });
            return;
        }

        const payload = decoded as CustomJwtPayload;

        req.user = {
            id: payload.id,
            email: payload.email,
            username: payload.username
        }
        
        next();
    });
}

export function checkOwnership(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.user) {
        res.status(401).json({ message: 'Authentication required before checking ownership' });
        return;
    }

    const requestedId = req.params.user_id;

    if (!requestedId) {
        res.status(400).json({ message: 'Resource id parameter required' });
        return;
    }

    if (req.user.id !== requestedId) {
        res.status(403).json({ message: 'You do not have permission to access this resource' });
        return;
    }

    next();
}