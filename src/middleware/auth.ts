import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers["authorization"];
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = header.slice("Bearer ".length);
    const secret = process.env.JWT_SECRET as string;
    if (!secret) return res.status(500).json({ message: "JWT secret missing" });
    const payload = jwt.verify(token, secret) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export default requireAuth;
