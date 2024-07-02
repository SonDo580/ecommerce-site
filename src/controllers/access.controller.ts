import { NextFunction, Response, Request } from "express";
import { AccessService } from "@root/services/access.service";
import { CreatedResponse } from "@root/core/success.response";

export class AccessController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    const result = await AccessService.signUp(req.body);
    new CreatedResponse(result).send(res);
  }
}
