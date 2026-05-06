import {Router} from "express";
import passport from "../config/passport.js";
import { register, login, logout, googleAuthCallback } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validation.js";
import { registerSchema, loginSchema } from "../validation/authValidation.js";


const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/login", session: false }),
    googleAuthCallback
);
export default router;

