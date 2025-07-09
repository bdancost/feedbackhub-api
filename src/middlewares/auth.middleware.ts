// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwtPayload"; // 👈 Importa o tipo personalizado

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload; // 👈 Usa o JwtPayload personalizado
}

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token ausente" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
};
