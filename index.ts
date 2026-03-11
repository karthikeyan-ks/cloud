import express from "express";
import { authenticateToken } from "./middlewares/jwttoken";
import authRouter from "./routes/auth.routes";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World! Your Express server is running.");
});

app.use(authenticateToken);
app.use("/auth", authRouter);

export default app;
