// src/controllers/feedback.controller.ts
import { Request, Response } from "express";
import { feedbackSchema } from "../schemas/feedback.schema";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { FeedbackService } from "../services/feedback.service";
import { sendFeedbackEmail } from "../utils/mailer";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export const FeedbackController = {
  // ✅ CREATE
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      logger.info("Recebendo requisição para criar feedback");

      const validatedData = feedbackSchema.parse(req.body);

      const feedback = await FeedbackService.createFeedback({
        ...validatedData,
        userId: Number(req.user?.id),
      });

      logger.info(
        `Feedback criado com sucesso (userId=${req.user?.id}, email=${validatedData.email})`
      );

      await sendFeedbackEmail(validatedData.email, validatedData.name);

      res.status(201).json(feedback);
    } catch (err) {
      if (err instanceof ZodError) {
        logger.warn("Erro de validação ao criar feedback");
        return res.status(400).json({
          error: "Erro de validação",
          details: err.errors,
        });
      }

      logger.error("Erro inesperado ao criar feedback: " + err);
      res.status(500).json({ error: "Erro ao criar feedback." });
    }
  },

  // ✅ GET ALL
  async getAll(_: Request, res: Response) {
    try {
      logger.info("Buscando todos os feedbacks");
      const feedbacks = await FeedbackService.getAllFeedbacks();
      res.json(feedbacks);
    } catch (error) {
      logger.error("Erro ao buscar todos os feedbacks: " + error);
      res.status(500).json({ error: "Erro ao buscar feedbacks." });
    }
  },

  // ✅ GET FEEDBACKS DO USUÁRIO LOGADO
  async getUserFeedbacks(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = Number(req.user?.id);
      logger.info(`Buscando feedbacks do usuário ID ${userId}`);

      const feedbacks = await FeedbackService.getFeedbacksByUser(userId);
      res.json(feedbacks);
    } catch (error) {
      logger.error("Erro ao buscar feedbacks do usuário: " + error);
      res.status(500).json({ error: "Erro ao buscar feedbacks do usuário." });
    }
  },

  // ✅ DELETE
  async delete(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    try {
      logger.info(`Tentando deletar feedback ID ${id}`);
      const result = await FeedbackService.deleteFeedback(
        id,
        Number(req.user?.id)
      );

      if (result === "not_found") {
        logger.warn(`Feedback ID ${id} não encontrado`);
        return res.status(404).json({ error: "Feedback não encontrado." });
      }

      if (result === "unauthorized") {
        logger.warn(`Usuário não autorizado a deletar feedback ID ${id}`);
        return res.status(403).json({ error: "Ação não permitida." });
      }

      logger.info(`Feedback ID ${id} deletado com sucesso`);
      res.json({ message: "Feedback deletado com sucesso." });
    } catch (error) {
      logger.error("Erro ao deletar feedback: " + error);
      res.status(500).json({ error: "Erro ao deletar feedback." });
    }
  },

  // ✅ UPDATE
  async update(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    const { name, email, message, rating } = req.body;

    try {
      logger.info(`Tentando atualizar feedback ID ${id}`);

      const updated = await FeedbackService.updateFeedback(
        id,
        Number(req.user?.id),
        { name, email, message, rating }
      );

      if (updated === "not_found") {
        logger.warn(`Feedback ID ${id} não encontrado`);
        return res.status(404).json({ error: "Feedback não encontrado." });
      }

      if (updated === "unauthorized") {
        logger.warn(`Usuário não autorizado a atualizar feedback ID ${id}`);
        return res.status(403).json({ error: "Ação não permitida." });
      }

      logger.info(`Feedback ID ${id} atualizado com sucesso`);
      res.json(updated);
    } catch (error) {
      logger.error("Erro ao atualizar feedback: " + error);
      res.status(500).json({ error: "Erro ao atualizar feedback." });
    }
  },
};
