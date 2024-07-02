import { NextFunction, Response, Request } from "express";
import httpStatus from "http-status";
import { AccessService } from "@root/services/access.service";

export class AccessController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    const result = await AccessService.signUp(req.body);
    res.status(httpStatus.CREATED).json(result);
  }
}
