// src/routes/feedback.route.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const prisma = new PrismaClient();

// 🔒 Rota protegida para envio de feedback
router.post("/", authenticateToken, async (req, res) => {
  const { name, email, message, rating } = req.body;

  try {
    const feedback = await prisma.feedback.create({
      data: { name, email, message, rating },
    });

    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar feedback." });
  }
});

// ✅ Rota pública para listar feedbacks
router.get("/", async (_, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar feedbacks." });
  }
});

export default router;
