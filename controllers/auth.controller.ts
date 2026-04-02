import { Request, Response } from "express";
import { Auth } from "../types/auth.type";
import { BaseReponse } from "../types/base.type";
import { IGCPPubSubService } from "../services/gcp/pubsub/pubsub-service.interface";
export class AuthController {

  constructor(
    private gcpService: IGCPPubSubService
  ){}

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

    try {
      await this.gcpService.publish(response)
    } catch (error) {
      console.error("Failed to publish Pub/Sub message", error);

      return res.status(500).json({
        error: true,
        message: "Unable to publish login event",
        data: null
      });
    }
    
   

    return res.json(response);
  }

}
