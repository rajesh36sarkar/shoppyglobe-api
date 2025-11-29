import express from "express";
import { body, validationResult } from "express-validator";
import { register, login, refresh, logout } from "../controllers/authController.js";

const router = express.Router();

// REGISTER
router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("name").isString().notEmpty(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    return register(req, res, next);
  }
);

// LOGIN
router.post(
  "/login",
  body("email").isEmail(),
  body("password").exists(),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    return login(req, res, next);
  }
);

// REFRESH TOKEN
router.post("/refresh", refresh);

// LOGOUT
router.post("/logout", logout);

export default router;
