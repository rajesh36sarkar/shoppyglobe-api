import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../services/tokenService.js";

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash });
    await user.save();

    res.status(201).json({ message: "User registered", userId: user.userId });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const payload = { userId: user.userId, id: user._id, email: user.email };

    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    // store refresh token in DB for rotation and revoke
    user.refreshToken = refreshToken;
    await user.save();

    // set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: { userId: user.userId, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token" });

    // verify signature
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (e) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // check DB stored token matches (rotation)
    const user = await User.findOne({ _id: payload.id });
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ error: "Refresh token revoked" });
    }

    // create new tokens (rotate)
    const newPayload = { userId: user.userId, id: user._id, email: user.email };
    const newAccessToken = createAccessToken(newPayload);
    const newRefreshToken = createRefreshToken(newPayload);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      // remove refresh token from DB
      try {
        const payload = verifyRefreshToken(token);
        await User.findOneAndUpdate({ _id: payload.id }, { $set: { refreshToken: null } });
      } catch (e) {
        // ignore invalid token
      }
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};

export { register, login, refresh, logout };
