import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = jwt.sign(
      { userId: String(user._id) },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    return res.status(201).json({
      token,
      user: { id: String(user._id), name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: String(user._id) },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    return res.json({
      token,
      user: { id: String(user._id), name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
}

export default { register, login };
