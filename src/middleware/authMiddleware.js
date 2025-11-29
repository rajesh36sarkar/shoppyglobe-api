import { verifyAccessToken } from "../services/tokenService.js";

const auth = (req, res, next) => {
  try {
    const header = req.headers["authorization"] || req.header("Authorization");
    if (!header) return res.status(401).json({ error: "No authorization header" });

    const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;
    if (!token) return res.status(401).json({ error: "Token required" });

    const decoded = verifyAccessToken(token);
    req.user = decoded; // id, userId, email
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default auth;
