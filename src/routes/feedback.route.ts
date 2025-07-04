// src/routes/feedback.routes.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
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

router.get("/", async (_, res) => {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(feedbacks);
});

export default router;
