import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * protect middleware
 *
 * Reads the JWT from either:
 * 1. The httpOnly cookie ("token")
 * 2. The Authorization header ("Bearer <token>")
 *
 * Verifies the token, loads the user from MongoDB (without the password),
 * and attaches it to req.user for use in downstream controllers.
 *
 * Returns 401 if the token is missing or invalid.
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check cookies
        if (req.cookies && req.cookies.token && req.cookies.token !== "none") {
            token = req.cookies.token;
        }
        // 2. Check Authorization header
        else if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated. Please log in.",
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "default_jwt_secret_key_change_me"
        );

        // Attach user to request (password excluded via schema select: false)
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session. Please log in again.",
        });
    }
};

export default protect;
