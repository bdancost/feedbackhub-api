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

      logger.error({ err }, "Erro inesperado ao criar feedback");
      res.status(500).json({ error: "Erro ao criar feedback." });
    }
  },

  // ✅ GET ALL
  async getAll(_: Request, res: Response) {
    try {
      logger.info("Listando todos os feedbacks");
      const feedbacks = await FeedbackService.getAllFeedbacks();
      res.json(feedbacks);
    } catch (error) {
      logger.error({ err: error }, "Erro ao buscar todos os feedbacks");
      res.status(500).json({ error: "Erro ao buscar feedbacks." });
    }
  },

  // ✅ GET FEEDBACKS DO USUÁRIO LOGADO
  async getUserFeedbacks(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = Number(req.user?.id);
      logger.info(`Listando feedbacks do usuário ID ${userId}`);

      const feedbacks = await FeedbackService.getFeedbacksByUser(userId);
      res.json(feedbacks);
    } catch (error) {
      logger.error({ err: error }, "Erro ao buscar feedbacks do usuário");
      res.status(500).json({ error: "Erro ao buscar feedbacks do usuário." });
    }
  },

  // ✅ DELETE
  async delete(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    try {
      logger.info(`Recebendo requisição para deletar feedback ID ${id}`);
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
      logger.error({ err: error }, "Erro ao deletar feedback");
      res.status(500).json({ error: "Erro ao deletar feedback." });
    }
  },

  // ✅ UPDATE com validação parcial
  async update(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;
    logger.info(`Recebendo requisição para atualizar feedback ID ${id}`);

    try {
      const updateSchema = feedbackSchema.partial(); // Valida apenas campos enviados
      const validatedUpdate = updateSchema.parse(req.body);

      const updated = await FeedbackService.updateFeedback(
        id,
        Number(req.user?.id),
        validatedUpdate
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
    } catch (err) {
      if (err instanceof ZodError) {
        logger.warn("Erro de validação ao atualizar feedback");
        return res.status(400).json({
          error: "Erro de validação",
          details: err.errors,
        });
      }

      logger.error({ err }, "Erro ao atualizar feedback");
      res.status(500).json({ error: "Erro ao atualizar feedback." });
    }
  },
};
