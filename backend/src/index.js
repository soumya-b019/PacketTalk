import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();
const PORT = process.env.PORT ?? 8080;
const __dirname = path.resolve();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// middleware to extract json-data from body
app.use(express.json());

// to parse the cookie
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  const indexPath = path.join(frontendPath, "index.html");

  console.log("Frontend build path:", frontendPath);
  console.log("Index file path:", indexPath);

  // Serve static files from the React app build directory
  app.use(express.static(frontendPath));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(indexPath);
  });
}

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
  connectDB();
});
