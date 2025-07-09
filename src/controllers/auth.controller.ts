import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn("Tentativa de registro sem email ou senha");
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      logger.warn(`Usuário já existe: ${email}`);
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    logger.info(`Usuário registrado com sucesso: ${email}`);
    return res
      .status(201)
      .json({ message: "User created successfully", userId: user.id });
  } catch (error) {
    logger.error({ err: error }, "Erro ao registrar usuário");
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn("Tentativa de login sem email ou senha");
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      logger.warn(`Login inválido - usuário não encontrado: ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      logger.warn(`Login inválido - senha incorreta para o email: ${email}`);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    logger.info(`Login bem-sucedido: ${email}`);

    // 🔁 Envia token + dados do usuário
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error({ err: error }, "Erro ao fazer login");
    return res.status(500).json({ error: "Internal server error" });
  }
};
