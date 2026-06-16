import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix .env path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
  quiet: true
});

import app from "./server.js";
import { connectDatabase } from "./lib/database.js";
import authRoutes from "./routes/auth.routes.js"; // ✅ MOVE HERE

const port = process.env.PORT || 5000;

// Connect DB first
await connectDatabase();

// Register routes
app.use("/api", authRoutes);

app.listen(port, () => {
  
});