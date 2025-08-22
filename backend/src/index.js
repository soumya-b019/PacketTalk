import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";

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
  // Try multiple possible paths for the frontend build
  const possiblePaths = [
    path.join(__dirname, "../../frontend/dist"),
    path.join(__dirname, "../frontend/dist"),
    path.join(__dirname, "./frontend/dist"),
    path.join(process.cwd(), "frontend/dist"),
  ];

  let frontendPath = null;
  let indexPath = null;

  for (const testPath of possiblePaths) {
    const testIndexPath = path.join(testPath, "index.html");
    if (fs.existsSync(testIndexPath)) {
      frontendPath = testPath;
      indexPath = testIndexPath;
      console.log("Found frontend build at:", frontendPath);
      break;
    }
  }

  if (!frontendPath) {
    console.error(
      "ERROR: Could not find frontend build in any of these paths:"
    );
    possiblePaths.forEach((p) => console.error("  -", p));

    // Serve a simple error page instead of crashing
    app.get("*", (req, res) => {
      res.status(500).send(`
        <html>
          <head><title>Build Error</title></head>
          <body>
            <h1>Build Error</h1>
            <p>Frontend build files not found. Please check the build process.</p>
            <p>Searched paths:</p>
            <ul>
              ${possiblePaths.map((p) => `<li>${p}</li>`).join("")}
            </ul>
          </body>
        </html>
      `);
    });
    return;
  }

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
