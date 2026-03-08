"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    async login(req, res) {
        const response = {
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
exports.AuthController = AuthController;
