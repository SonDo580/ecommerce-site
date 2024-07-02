import { Response } from "express";
import httpStatus from "http-status";

class BaseResponse<T> {
  constructor(public readonly result: T, public readonly status: number) {}

  send(res: Response) {
    res.status(this.status).json(this.result);
  }
}

export class SuccessResponse<T> extends BaseResponse<T> {
  constructor(result: T) {
    super(result, httpStatus.OK);
  }
}

export class CreatedResponse<T> extends BaseResponse<T> {
  constructor(result: T) {
    super(result, httpStatus.CREATED);
  }
}
