

import express from "express";

import { router } from "@/routes";
import { errorMiddleware } from "@/middlewares/error.middleware";
import { notFoundMiddleware } from "@/middlewares/not-found.middleware";

export const app = express();

// Permite recibir JSON en requests
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    service: "yugioh-store-backend",
    status: "ok",
  });
});

// Rutas principales
app.use("/api", router);

// Ruta no encontrada
app.use(notFoundMiddleware);

// Manejo global de errores
app.use(errorMiddleware);