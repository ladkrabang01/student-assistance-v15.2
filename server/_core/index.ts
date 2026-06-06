import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { ENV, isCriticalEnvMissing } from "./env";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

export function createApp() {
  const app = express();
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Validation middleware - check critical env vars before processing requests
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      if (isCriticalEnvMissing()) {
        const missing = [];
        if (!ENV.appId) missing.push("VITE_APP_ID");
        if (!ENV.cookieSecret) missing.push("JWT_SECRET");
        if (!ENV.databaseUrl) missing.push("DATABASE_URL");
        if (!ENV.oAuthServerUrl) missing.push("OAUTH_SERVER_URL");
        
        console.error("[Validation] Missing critical environment variables:", missing);
        
        return res.status(500).json({
          error: {
            message: "Server configuration error",
            details: `Missing environment variables: ${missing.join(", ")}`,
            status: 500,
          },
        });
      }
      next();
    } catch (error) {
      console.error("[Validation Middleware Error]", error);
      res.status(500).json({
        error: {
          message: "Server validation error",
          status: 500,
        },
      });
    }
  });
  
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    const server = createServer(app);
    setupVite(app, server).catch(console.error);
  } else {
    serveStatic(app);
  }
  
  // Global error handler - ensure all errors return JSON
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[Global Error Handler]", {
      message: err.message,
      code: err.code,
      status: err.status,
      stack: err.stack?.split("\n")[0],
    });
    
    // Don't override response if headers already sent
    if (res.headersSent) {
      console.warn("[Global Error Handler] Headers already sent, cannot send error response");
      return next(err);
    }
    
    // Determine status code
    let statusCode = 500;
    if (err.status) statusCode = err.status;
    else if (err.statusCode) statusCode = err.statusCode;
    else if (err.code === "ECONNREFUSED") statusCode = 503; // Service unavailable
    else if (err.code === "ENOTFOUND") statusCode = 503; // Service unavailable
    
    // Return JSON error response - ALWAYS JSON, never plain text
    res.status(statusCode).json({
      error: {
        message: err.message || "Internal Server Error",
        code: err.code || "INTERNAL_ERROR",
        status: statusCode,
        timestamp: new Date().toISOString(),
      },
    });
  });
  
  // 404 handler - also returns JSON
  app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
      error: {
        message: "Not Found",
        path: req.path,
        status: 404,
      },
    });
  });
  
  return app;
}

async function startServer() {
  const app = createApp();
  const server = createServer(app);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

// Only start server if not in Vercel serverless environment
if (process.env.VERCEL !== "1") {
  startServer().catch(console.error);
}
