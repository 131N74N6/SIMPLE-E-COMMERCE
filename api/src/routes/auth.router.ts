import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller";

const authRouters = Router();

authRouters.post('/sign-up', signUp);
authRouters.post('/sign-in', signIn);

export default authRouters;