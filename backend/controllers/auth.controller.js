import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET || "default_jwt_secret_key_change_me",
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
};

/**
 * Helper to send token response with cookie and json data
 */
const sendTokenResponse = (user, statusCode, res, message) => {
    const token = generateToken(user._id);

    // Cookie configuration
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.status(statusCode)
        .cookie("token", token, cookieOptions)
        .json({
            success: true,
            message,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: name, email, and password",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with this email address already exists",
            });
        }

        // Create new user (password is hashed automatically by userSchema pre-save hook)
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: role || "receptionist",
        });

        sendTokenResponse(user, 201, res, "Account registered successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user with email and password
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password",
            });
        }

        // Check for user (must explicitly select +password since it has select: false)
        const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare entered password with stored hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        sendTokenResponse(user, 200, res, "Logged in successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (protect middleware)
 */
export const getMe = async (req, res, next) => {
    try {
        // req.user is attached by the protect middleware
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                createdAt: req.user.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user and clear session cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 5 * 1000), // expires in 5 seconds
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
