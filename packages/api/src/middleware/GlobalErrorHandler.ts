// src/middleware/ErrorHandler.ts
import {
  ExpressErrorMiddlewareInterface,
  HttpError,
  Middleware,
} from "routing-controllers";
import { Request, Response, NextFunction } from "express";

@Middleware({ type: "after" }) // 'after' = error handler
export class GlobalErrorHandler implements ExpressErrorMiddlewareInterface {
  error(
    error: any,
    request: Request,
    response: Response,
    next: NextFunction
  ): void {
    console.error("Global Error:", error);

    if (error instanceof HttpError) {
      response.status(error.httpCode).json(error);
    } else {
      response.status(error.httpCode || 500).json({
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }
}
