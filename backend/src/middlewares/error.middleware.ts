import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

type AppError = Error & {
  statusCode?: number;
};

export const errorMiddleware: ErrorRequestHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(error);

  const statusCode =
    error.statusCode ?? 500;

  const message =
    error.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};