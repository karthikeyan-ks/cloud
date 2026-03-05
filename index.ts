import express from "express";
import { authenticateToken } from "./middlewares/jwttoken";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(express.json());
app.use(authenticateToken);
app.use("/auth", authRouter);

export default app;