import { Router } from "express";
import { googleLogin } from "../controllers/auth.controller.js";

const router = Router();

router.post("/google-login", googleLogin);

export default router;