// src/services/feedback.service.ts
import { FeedbackRepository } from "../repositories/feedback.repository";
import { sendFeedbackEmail } from "../utils/mailer";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

export const FeedbackService = {
  async createFeedback(data: {
    name: string;
    email: string;
    message: string;
    rating: number;
    userId: number;
  }) {
    const feedback = await FeedbackRepository.create(data);
    await sendFeedbackEmail(data.email, data.name);
    return feedback;
  },

  async getAllFeedbacks() {
    return FeedbackRepository.getAll();
  },

  async getFeedbacksByUser(userId: number) {
    return FeedbackRepository.getByUserId(userId);
  },

  async deleteFeedback(id: string, userId: number) {
    const feedback = await FeedbackRepository.findById(id);
    if (!feedback) throw new NotFoundError("Feedback não encontrado");
    if (feedback.userId !== userId)
      throw new UnauthorizedError("Ação não permitida");

    await FeedbackRepository.delete(id);
    return { message: "Feedback deletado com sucesso" };
  },

  async updateFeedback(
    id: string,
    userId: number,
    data: { name?: string; email?: string; message?: string; rating?: number }
  ) {
    const feedback = await FeedbackRepository.findById(id);
    if (!feedback) throw new NotFoundError("Feedback não encontrado");
    if (feedback.userId !== userId)
      throw new UnauthorizedError("Ação não permitida");

    const updated = await FeedbackRepository.update(id, data);
    return {
      message: "Feedback atualizado com sucesso",
      feedback: updated,
    };
  },
};
