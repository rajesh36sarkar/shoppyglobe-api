import jwt from "jsonwebtoken";

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const createRefreshToken = (payload) => {
  // refresh tokens live longer and are stored server-side
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
};

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

export { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken };
