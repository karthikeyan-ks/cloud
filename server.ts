import "dotenv/config";
import app from "./index";
import { connectToDatabase } from "./config/database";
import Container from "./container";
import { GCPBaseService } from "./services/gcp/gcp-base.service";
import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT || 8080);

const gcpBaseService: GCPBaseService = Container.resolve("gcpBaseService");

async function startServer() {
  console.log("Starting server...");
  try {
    await connectToDatabase();
    gcpBaseService.init();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

void startServer();
