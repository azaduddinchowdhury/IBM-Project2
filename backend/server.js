import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import visitorRoutes from "./routes/visitore.route.js";
import authRoutes from "./routes/auth.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import seedInitialUsers from "./config/seed.js";

dotenv.config();

const app = express();

// Connect to MongoDB and seed initial users if necessary
connectDB().then(() => {
    seedInitialUsers();
});

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Employee Visitor Management API is running",
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Visitor management routes
app.use("/api/visitors", visitorRoutes);

// Centralized error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});