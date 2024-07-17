import { Response } from "express";

import { AccessService } from "@root/services/access.service";
import { CreatedResponse, SuccessResponse } from "@root/core/success.response";
import { CustomRequest } from "@root/types";
import { Headers } from "@root/middlewares/auth.middleware";

export class AccessController {
  static async signUp(req: CustomRequest, res: Response) {
    const result = await AccessService.signUp(req.body);
    new CreatedResponse(result).send(res);
  }

  static async login(req: CustomRequest, res: Response) {
    const result = await AccessService.login(req.body);
    new SuccessResponse(result).send(res);
  }

  static async logout(req: CustomRequest, res: Response) {
    const result = await AccessService.logout(req.keyToken);
    new SuccessResponse(result).send(res);
  }

  static async handleRefreshToken(req: CustomRequest, res: Response) {
    const result = await AccessService.handleRefreshToken(
      req.keyToken,
      req.headers[Headers.REFRESH_TOKEN] as string
    );
    new SuccessResponse(result).send(res);
  }
}
