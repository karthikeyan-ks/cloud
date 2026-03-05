import { Request, Response } from "express";
import { Auth } from "../types/auth.type";
import { BaseReponse } from "../types/base.type";

export class AuthController {

  async login(req: Request, res: Response): Promise<Response> {

    const response: BaseReponse<string, Auth> = {
      error: false,
      message: "Login successful",
      data: {
        id: 1,
        role: {
          id: 1,
          name: "Admin"
        },
        name: "admin",
        email: "admin@gmail.com"
      }
    };

    return res.json(response);
  }

}