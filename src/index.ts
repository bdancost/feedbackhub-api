// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import feedbackRoutes from "./routes/feedback.route";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/feedback", feedbackRoutes);

const PORT = process.env.PORT || 3333;

app.get("/", (req, res) => {
  res.send("FeedbackHub API rodando 🚀");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
