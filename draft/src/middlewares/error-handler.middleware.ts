import { NextFunction, RequestHandler, Response } from "express";
import httpStatus from "http-status";

import { CustomRequest } from "@root/interfaces/custom-request.interface";
import { HttpError } from "@root/core/error.response";
import { ErrorMessage } from "@root/constants/message.const";
import { GENERAL_CONFIG } from "@root/configs/general.config";
import { NodeEnv } from "@root/constants";

export const errorHandler = (
  err: Error,
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const statusCode =
    err instanceof HttpError ? err.status : httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || ErrorMessage.INTERNAL_SERVER_ERROR;
  const stack =
    GENERAL_CONFIG.NODE_ENV === NodeEnv.DEVELOPMENT ? err.stack : undefined;

  res.status(statusCode).json({
    message,
    stack,
  });
};

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
