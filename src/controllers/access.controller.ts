import { NextFunction, Response, Request } from "express";

import { AccessService } from "@root/services/access.service";
import { CreatedResponse, SuccessResponse } from "@root/core/success.response";

export class AccessController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    const result = await AccessService.signUp(req.body);
    new CreatedResponse(result).send(res);
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    const result = await AccessService.login(req.body);
    new SuccessResponse(result).send(res);
  }
}
