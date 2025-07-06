// src/routes/feedback.route.ts
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { FeedbackController } from "../controllers/feedback.controller";

const router = Router();

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Cria um novo feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message, rating]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Feedback criado com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno
 */

router.post("/", authenticateToken, FeedbackController.create);

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Lista todos os feedbacks
 *     tags: [Feedback]
 *     responses:
 *       200:
 *         description: Lista de feedbacks
 *       500:
 *         description: Erro interno
 */

router.get("/", FeedbackController.getAll);

/**
 * @swagger
 * /feedback/my:
 *   get:
 *     summary: Lista feedbacks do usuário logado
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de feedbacks do usuário
 *       500:
 *         description: Erro interno
 */

router.get("/my", authenticateToken, FeedbackController.getUserFeedbacks);

/**
 * @swagger
 * /feedback/{id}:
 *   put:
 *     summary: Atualiza um feedback existente
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do feedback
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Feedback atualizado
 *       404:
 *         description: Feedback não encontrado
 *       403:
 *         description: Ação não permitida
 *       500:
 *         description: Erro interno
 */

router.put("/:id", authenticateToken, FeedbackController.update);

/**
 * @swagger
 * /feedback/{id}:
 *   delete:
 *     summary: Deleta um feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID do feedback
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Feedback deletado com sucesso
 *       404:
 *         description: Feedback não encontrado
 *       403:
 *         description: Ação não permitida
 *       500:
 *         description: Erro interno
 */

router.delete("/:id", authenticateToken, FeedbackController.delete);

export default router;
