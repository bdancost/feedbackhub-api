// src/controllers/feedback.controller.ts
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { FeedbackService } from "../services/feedback.service";

export const FeedbackController = {
  async create(req: AuthenticatedRequest, res: Response) {
    const { name, email, message, rating } = req.body;
    const userId = Number(req.user?.id);

    try {
      const feedback = await FeedbackService.createFeedback({
        name,
        email,
        message,
        rating,
        userId,
      });

      res.status(201).json(feedback);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar feedback." });
    }
  },

  async getAll(_: Request, res: Response) {
    try {
      const feedbacks = await FeedbackService.getAllFeedbacks();
      res.json(feedbacks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar feedbacks." });
    }
  },

  async getUserFeedbacks(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = Number(req.user?.id);
      const feedbacks = await FeedbackService.getFeedbacksByUser(userId);
      res.json(feedbacks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar feedbacks do usuário." });
    }
  },

  async delete(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    try {
      const result = await FeedbackService.deleteFeedback(
        id,
        Number(req.user?.id)
      );

      if (result === "not_found") {
        return res.status(404).json({ error: "Feedback não encontrado." });
      }

      if (result === "unauthorized") {
        return res.status(403).json({ error: "Ação não permitida." });
      }

      res.json({ message: "Feedback deletado com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar feedback." });
    }
  },

  async update(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { name, email, message, rating } = req.body;

    try {
      const updated = await FeedbackService.updateFeedback(
        id,
        Number(req.user?.id),
        { name, email, message, rating }
      );

      if (updated === "not_found") {
        return res.status(404).json({ error: "Feedback não encontrado." });
      }

      if (updated === "unauthorized") {
        return res.status(403).json({ error: "Ação não permitida." });
      }

      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar feedback." });
    }
  },
};
