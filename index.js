import express from "express";
import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as dotenv from "dotenv";

// Determine __dirname in ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from your .env file
dotenv.config({ path: `${__dirname}/.env` });

console.log("ImageKit Public Key:", process.env.IMAGEKIT_PUBLIC_KEY);
console.log("ImageKit Private Key:", process.env.IMAGEKIT_PRIVATE_KEY);
console.log("ImageKit URL Endpoint:", process.env.IMAGEKIT_URL_ENDPOINT);

const app = express();

// CORS configuration allowing your deployed client and local development.
// Ensure that the CLIENT_URL environment variable is set to 'https://pcmi-blog-client.vercel.app' on Vercel.
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:5173"],
    credentials: true,
  })
);

// New logging middleware with timestamp
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Backend received request: ${req.method} ${req.url}`);
  next();
});

// Existing debug logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Test endpoint for connectivity check (/api/connection-test)
app.get("/api/connection-test", (req, res) => {
  console.log("Connection test endpoint hit by client");
  return res.status(200).json({ 
    message: "Backend connection successful", 
    timestamp: new Date().toISOString() 
  });
});

// Original test endpoint (if still needed)
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Clerk middleware integration
app.use(clerkMiddleware());

// Define webhook routes
app.use("/webhooks", webhookRouter);

// Parse JSON bodies
app.use(express.json());

// Additional CORS headers (for broader compatibility)
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.CLIENT_URL || "http://localhost:5173"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the PCMI Blog API" });
});

// Existing routes
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

// Error handling middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

// Start the server or connect to the database based on the environment
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Backend server running on port ${PORT}`);
    console.log(
      `Backend ready to accept connections from client: ${process.env.CLIENT_URL || "http://localhost:5173"}`
    );
  });
} else {
  connectDB().then(() => {
    console.log("Backend connected to database in production mode");
    console.log(
      `Backend ready to accept connections from client: ${process.env.CLIENT_URL || "https://pcmi-blog-client.vercel.app"}`
    );
  });
}

// Export the Express app for Vercel serverless deployment
export default app;