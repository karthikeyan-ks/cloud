import { Router } from "express";
import { AuthController } from "../controllers";
import { IGCPPubSubService } from "../services/gcp/pubsub/pubsub-service.interface";
import Container from "../container";

const GCPPubSubService: IGCPPubSubService = Container.resolve("GCPPubSubService");

const authRouter: Router = Router();
const authController: AuthController = new AuthController(GCPPubSubService);

authRouter.post("/login", authController.login.bind(authController));

export default authRouter;