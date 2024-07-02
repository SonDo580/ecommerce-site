import httpStatus from "http-status";
import { ErrorMessage } from "@root/constants/message.const";

export class HttpError extends Error {
  constructor(public readonly message: string, public readonly status: number) {
    super(message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = ErrorMessage.BAD_REQUEST) {
    super(message, httpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = ErrorMessage.UNAUTHORIZED) {
    super(message, httpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = ErrorMessage.FORBIDDEN) {
    super(message, httpStatus.FORBIDDEN);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = ErrorMessage.NOT_FOUND) {
    super(message, httpStatus.NOT_FOUND);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = ErrorMessage.NOT_FOUND) {
    super(message, httpStatus.CONFLICT);
  }
}