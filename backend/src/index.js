import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

// Routes
import authRoutes from "./routes/auth.js";
import generateRoutes from "./routes/generate.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - Required for Render and other reverse proxies
app.set("trust proxy", 1);

// Swagger UI — tắt helmet CSP riêng cho route /api-docs
app.use("/api-docs", (req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:",
  );
  next();
});
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Happy Coloring AI – API Docs",
    swaggerOptions: { persistAuthorization: true },
  }),
);

// Middleware
app.use(helmet());

// CORS configuration - cho phép cả localhost và production frontend
const normalizeOrigin = (value) => value?.trim().replace(/\/+$/, "");

const envOrigins = [process.env.CORS_ORIGIN, process.env.FRONTEND_URL]
  .flatMap((value) => (value ? value.split(",") : []))
  .map(normalizeOrigin)
  .filter(Boolean);

const allowedOrigins = new Set(
  [
    "http://localhost:3002",
    "https://paint-by-numbers-ai-607c4.web.app",
    "https://paint-by-numbers-ai-607c4.firebaseapp.com",
    "https://happy-coloring-ai.vercel.app",
    ...envOrigins,
  ]
    .map(normalizeOrigin)
    .filter(Boolean),
);

const isAllowedVercelOrigin = (origin) => {
  try {
    const parsed = new URL(origin);
    return (
      parsed.protocol === "https:" && parsed.hostname.endsWith(".vercel.app")
    );
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (như mobile apps hoặc curl)
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);

      if (
        allowedOrigins.has(normalizedOrigin) ||
        normalizedOrigin.includes("localhost") ||
        isAllowedVercelOrigin(normalizedOrigin)
      ) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Root route - Welcome message
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Happy Coloring AI API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      generate: "/api/generate",
      products: "/api/products",
      orders: "/api/orders",
      users: "/api/users",
      admin: "/api/admin",
    },
    documentation: "https://github.com/baody613/Happy_Coloring_AI",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// API Routes
app.use("/api/admin", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

// Swagger JSON spec (để import vào Postman nếu cần)
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app
  .listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    console.log(
      `🌐 CORS Origin: ${
        process.env.CORS_ORIGIN ||
        process.env.FRONTEND_URL ||
        "http://localhost:3000"
      }`,
    );
  })
  .on("error", (err) => {
    console.error("❌ Server error:", err);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

export default app;
