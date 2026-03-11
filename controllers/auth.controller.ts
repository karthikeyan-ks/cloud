import { Request, Response } from "express";
import { Auth } from "../types/auth.type";
import { BaseReponse } from "../types/base.type";
import { GCPService } from "../services/gcp/gcp-pubsub-topic.service";

export class AuthController {

  constructor(
    private gcpService: GCPService
  ){}

  async login(req: Request, res: Response): Promise<Response> {
    try {
      await this.gcpService.publishPubSub();
    } catch (error) {
      console.error("Failed to publish Pub/Sub message", error);

      return res.status(500).json({
        error: true,
        message: "Unable to publish login event",
        data: null
      });
    }
    
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
