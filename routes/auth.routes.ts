import { Router } from "express";
import { AuthController } from "../controllers";

const authRouter: Router = Router();
const authController: AuthController = new AuthController();

authRouter.post("/login", authController.login.bind(authController));

export default authRouter;