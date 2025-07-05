// src/repositories/feedback.repository.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const FeedbackRepository = {
  async create(data: {
    name: string;
    email: string;
    message: string;
    rating: number;
    userId: number;
  }) {
    return prisma.feedback.create({ data });
  },

  async getAll() {
    return prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async getByUserId(userId: number) {
    return prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.feedback.findUnique({ where: { id } });
  },

  async delete(id: string) {
    return prisma.feedback.delete({ where: { id } });
  },

  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      message?: string;
      rating?: number;
    }
  ) {
    return prisma.feedback.update({
      where: { id },
      data,
    });
  },
};
