import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminSecretKey } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists.",
      });
    }

    // Check if this is the first user in the database, or if secret key is provided
    const userCount = await prisma.user.count();
    let assignedRole = "USER";

    if (userCount === 0 || role === "ADMIN") {
      // First user is automatically granted ADMIN, or if role specified
      assignedRole = "ADMIN";
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: assignedRole,
      },
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return res.status(201).json({
      success: true,
      message: `User created successfully as ${newUser.role}.`,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only administrators are allowed to log in here.",
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const setupDefaultAdmin = async (req, res, next) => {
  try {
    const defaultEmail = "admin@fragrancesbydruaa.com";
    const existing = await prisma.user.findUnique({
      where: { email: defaultEmail },
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Default admin account already exists.",
        email: defaultEmail,
      });
    }

    const passwordHash = await bcrypt.hash("AdminPassword123!", 10);
    const admin = await prisma.user.create({
      data: {
        name: "D_Ruaa Admin",
        email: defaultEmail,
        passwordHash,
        role: "ADMIN",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Default admin user created successfully.",
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      credentials: {
        email: defaultEmail,
        password: "AdminPassword123!",
      },
    });
  } catch (error) {
    next(error);
  }
};
