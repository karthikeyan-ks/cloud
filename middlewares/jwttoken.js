"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const publicRoutes = [
    '/login',
    '/register',
    '/'
];
function authenticateToken(req, res, next) {
    if (publicRoutes.includes(req.path))
        return next();
    const authHeader = req.headers['authorization'];
    if (!authHeader)
        return res.status(401).json({
            message: 'Token missing',
            error: true
        });
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({
            message: 'Invalid or expired token'
        });
    }
}
