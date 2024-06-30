import { AccessService } from "@root/services/access.service";
import { NextFunction, Response, Request } from "express";

export class AccessController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AccessService.signUp(req.body)
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
}
