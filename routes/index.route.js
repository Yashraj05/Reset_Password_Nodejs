import express from 'express'

import { signUpController, resetPasswordRequestController, resetPasswordController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/auth/signup", signUpController);
router.post("/auth/requestResetPassword", resetPasswordRequestController);
router.post("/auth/resetPassword", resetPasswordController);

export default router;
