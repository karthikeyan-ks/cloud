import { Router } from "express";
import { AuthController } from "../controllers";
import { GCPService } from "../services/gcp/gcp-pubsub-topic.service";

const authRouter: Router = Router();
const authController: AuthController = new AuthController(new GCPService());

authRouter.post("/login", authController.login.bind(authController));

export default authRouter;