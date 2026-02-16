import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_change_in_production_123456";

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the dist folder
const distPath = path.resolve(__dirname, "../dist");
console.log(`Serving static files from: ${distPath}`);
app.use(express.static(distPath));

// Types
interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

// Utility Functions
const hashPassword = async (password: string) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

const comparePassword = async (password: string, hash: string) => {
  return bcryptjs.compare(password, hash);
};

const generateToken = (userId: string, email: string) => {
  return jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Middleware: Verify token
const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// RBAC: require role(s)
const requireRole = (roles: string | string[]) => {
  const roleList = Array.isArray(roles) ? roles : [roles];
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
      const user = await prisma.user.findUnique({ where: { id: req.userId } });
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      if (!roleList.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

// Audit logging helper
const logAudit = async (
  req: AuthRequest,
  userId: string | undefined,
  action: string,
  resource: string,
  details?: any
) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        resource,
        details: details || null,
        ip: (req.ip as string) || null,
      } as any,
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
};

// Routes

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Backend server is running" });
});

// Register
app.post("/api/auth/register", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName: fullName || "",
        role: "user",
      },
    });

    // Generate token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
app.post("/api/auth/login", async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: "User account is inactive" });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Forgot Password
app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, don't reveal if email exists or not
      return res.json({
        message: "If the email exists, a reset link will be sent",
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    // Save reset token to database
    await prisma.passwordReset.create({
      data: {
        email,
        token: resetToken,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      },
    });

    // In a real application, send email with reset link
    // For now, return the token (in production, send via email)
    res.json({
      message: "Password reset link has been sent to your email",
      resetToken,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to process forgot password" });
  }
});

// Reset Password
app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required" });
    }

    // Verify token exists and is not expired
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Verify JWT
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ error: "Invalid reset token" });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// Get current user
app.get("/api/auth/me", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

// Example admin-only route: list users (logs audit)
app.get(
  "/api/admin/users",
  verifyToken,
  requireRole("admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true },
      });
      await logAudit(req, req.userId, "list_users", "users", { count: users.length });
      res.json({ users });
    } catch (error) {
      console.error("List users error:", error);
      res.status(500).json({ error: "Failed to list users" });
    }
  }
);

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const adminEmail = "admin@vura.pro";
    const adminPassword = "12345678";

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await hashPassword(adminPassword);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        fullName: "Admin User",
        role: "admin",
      },
    });

    console.log("✓ Default admin user created");
    console.log(`  Email: ${adminEmail}`);
    console.log(`  Password: ${adminPassword}`);
  } catch (error) {
    console.error("Failed to create default admin:", error);
  }
};

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Serve SPA - must be after all API routes
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Start server
const startServer = async () => {
  try {
    // Try to connect to database
    try {
      await prisma.$connect();
      console.log("✓ Connected to PostgreSQL database");
      // Create default admin user
      await createDefaultAdmin();
    } catch (dbError) {
      console.warn("⚠ Warning: Database connection failed. API routes will not work, but frontend will be served.");
      console.warn(`  Error: ${dbError}`);
    }

    app.listen(PORT, () => {
      console.log(
        `\n✓ Server running on http://localhost:${PORT}`
      );
      console.log(`✓ Frontend will be served from dist folder`);
      console.log(`\nAvailable API endpoints:`);
      console.log(`  POST   /api/auth/register`);
      console.log(`  POST   /api/auth/login`);
      console.log(`  POST   /api/auth/forgot-password`);
      console.log(`  POST   /api/auth/reset-password`);
      console.log(`  GET    /api/auth/me (requires token)`);
      console.log(`  GET    /api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
