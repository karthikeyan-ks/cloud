"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const authRouter = (0, express_1.Router)();
const authController = new controllers_1.AuthController();
authRouter.post("/login", authController.login.bind(authController));
exports.default = authRouter;
