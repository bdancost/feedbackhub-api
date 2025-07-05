// src/services/feedback.service.ts
import { FeedbackRepository } from "../repositories/feedback.repository";
import { sendFeedbackEmail } from "../utils/mailer";

export const FeedbackService = {
  async createFeedback(data: {
    name: string;
    email: string;
    message: string;
    rating: number;
    userId: number;
  }) {
    const feedback = await FeedbackRepository.create(data);

    // Enviar email de agradecimento
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

    if (!feedback) return "not_found";
    if (feedback.userId !== userId) return "unauthorized";

    await FeedbackRepository.delete(id);
    return "deleted";
  },

  async updateFeedback(
    id: string,
    userId: number,
    data: { name?: string; email?: string; message?: string; rating?: number }
  ) {
    const feedback = await FeedbackRepository.findById(id);

    if (!feedback) return "not_found";
    if (feedback.userId !== userId) return "unauthorized";

    return FeedbackRepository.update(id, data);
  },
};
