import { Response } from "express";

import { AccessService } from "@root/services/access.service";
import { CreatedResponse, SuccessResponse } from "@root/core/success.response";
import { CustomRequest } from "@root/interfaces/custom-request.interface";
import { Headers } from "@root/constants";

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
    await AccessService.logout(req.keyToken!);
    new SuccessResponse({}).send(res);
  }

  static async handleRefreshToken(req: CustomRequest, res: Response) {
    const result = await AccessService.handleRefreshToken(
      req.keyToken!,
      req.headers[Headers.REFRESH_TOKEN] as string
    );
    new SuccessResponse(result).send(res);
  }
}
