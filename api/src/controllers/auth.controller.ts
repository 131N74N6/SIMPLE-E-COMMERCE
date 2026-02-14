import { Auth } from "../models/auth.model";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

dotenv.config();

async function signIn(req: Request, res: Response) {
    const { password, username } = req.body;

    if (!password || !username) {
        return res.status(400).json({ message: "Isi semua input field" });
    }

    try {
        const user = await Auth.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Username tidak ditemukan / keliru' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Password tidak ditemukan / keliru' });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET_KEY || 'jwt-token',
        );

        res.status(200).json({
            status: 'sign-in successfully',
            token,
            info: {
                id: user._id, 
                email: user.email, 
                username: user.username 
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function signUp(req: Request, res: Response) {
    const { created_at, email, password, username } = req.body;
    
    if (!email || !password || !username) {
        return res.status(400).json({ message: "Isi semua input field" });
    }

    try {
        const existingUsername = await Auth.findOne({ username });
        const existingEmail = await Auth.findOne({ email });

        if (existingUsername) {
            return res.status(400).json({ message: "username ini sudah digunakan" });
        }

        if (existingEmail) {
            return res.status(400).json({ message: "email ini sudah digunakan" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Auth({ created_at, email, password: hashedPassword, username });
        await user.save();

        res.status(200).json({ message: 'Akun berhasil dibuat' });
    } catch (error: any) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { signIn, signUp }