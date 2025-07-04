// src/routes/feedback.route.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middlewares/auth.middleware";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

const router = Router();
const prisma = new PrismaClient();

// 🔒 Rota protegida para envio de feedback
router.post("/", authenticateToken, async (req, res) => {
  const { name, email, message, rating } = req.body;

  try {
    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        message,
        rating,
        userId: Number((req as AuthenticatedRequest).user?.id),
      },
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

// 🔒 Rota protegida para listar feedbacks do usuário logado
router.get("/my", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { userId: Number(req.user?.id) },
      orderBy: { createdAt: "desc" },
    });

    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar feedbacks do usuário." });
  }
});

// 🔒 Rota protegida para deletar feedback do usuário logado
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;

    try {
      // Verifica se o feedback pertence ao usuário autenticado
      const feedback = await prisma.feedback.findUnique({
        where: { id },
      });

      if (!feedback) {
        return res.status(404).json({ error: "Feedback não encontrado." });
      }

      if (feedback.userId !== Number(req.user?.id)) {
        return res.status(403).json({ error: "Ação não permitida." });
      }

      await prisma.feedback.delete({
        where: { id },
      });

      res.json({ message: "Feedback deletado com sucesso." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao deletar feedback." });
    }
  }
);

router.put(
  "/:id",
  authenticateToken,
  async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const { name, email, message, rating } = req.body;

    try {
      // 1. Verifica se o feedback existe
      const feedback = await prisma.feedback.findUnique({
        where: { id },
      });

      if (!feedback) {
        return res.status(404).json({ error: "Feedback não encontrado." });
      }

      // 2. Verifica se o feedback pertence ao usuário autenticado
      if (feedback.userId !== Number(req.user?.id)) {
        return res.status(403).json({ error: "Ação não permitida." });
      }

      // 3. Atualiza o feedback
      const updatedFeedback = await prisma.feedback.update({
        where: { id },
        data: {
          name,
          email,
          message,
          rating,
        },
      });

      // 4. Retorna o feedback atualizado
      res.json(updatedFeedback);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar feedback." });
    }
  }
);

export default router;
