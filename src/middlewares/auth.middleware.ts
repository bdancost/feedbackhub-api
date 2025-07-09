import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// Interface do payload do JWT
interface JwtPayload {
  id: string;
  email: string;
}

// Interface estendida da Request para conter os dados do usuário
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Middleware de autenticação
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Ex: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded; // Agora `req.user` contém o userId e email do usuário autenticado

    next(); // continua para a rota protegida
  } catch (error) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
};
