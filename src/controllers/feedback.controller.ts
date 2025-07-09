import { Request, Response } from "express";
import { feedbackSchema } from "../schemas/feedback.schema";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { FeedbackService } from "../services/feedback.service";
import { sendFeedbackEmail } from "../utils/mailer";
import { ZodError } from "zod";
import { logger } from "../utils/logger";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

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

      logger.info(`Feedback ID ${id} deletado com sucesso`);
      res.json(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        logger.warn(error.message);
        return res.status(404).json({ error: error.message });
      }

      if (error instanceof UnauthorizedError) {
        logger.warn(error.message);
        return res.status(403).json({ error: error.message });
      }

      logger.error({ err: error }, "Erro ao deletar feedback");
      res.status(500).json({ error: "Erro ao deletar feedback." });
    }
  },

  // ✅ UPDATE
  async update(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    try {
      logger.info(`Recebendo requisição para atualizar feedback ID ${id}`);

      const updateSchema = feedbackSchema.partial(); // valida apenas os campos enviados
      const validatedUpdate = updateSchema.parse(req.body);

      const result = await FeedbackService.updateFeedback(
        id,
        Number(req.user?.id),
        validatedUpdate
      );

      logger.info(`Feedback ID ${id} atualizado com sucesso`);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Erro de validação ao atualizar feedback");
        return res.status(400).json({
          error: "Erro de validação",
          details: error.errors,
        });
      }

      if (error instanceof NotFoundError) {
        logger.warn(error.message);
        return res.status(404).json({ error: error.message });
      }

      if (error instanceof UnauthorizedError) {
        logger.warn(error.message);
        return res.status(403).json({ error: error.message });
      }

      logger.error({ err: error }, "Erro ao atualizar feedback");
      res.status(500).json({ error: "Erro ao atualizar feedback." });
    }
  },
};
