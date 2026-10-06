import express from "express";

import {
    createVisitor,
    getAllVisitors,
    getVisitorById,
    updateVisitor,
    deleteVisitor,
    updateVisitorStatus,
} from "../controllers/visit.controller.js";

const router = express.Router();


// Create visitor
router.post("/", createVisitor);


// Get all visitors / Search visitors
router.get("/", getAllVisitors);


// Get single visitor
router.get("/:id", getVisitorById);


// Update visitor
router.put("/:id", updateVisitor);


// Delete visitor
router.delete("/:id", deleteVisitor);


// Update visitor status
router.patch("/:id/status", updateVisitorStatus);


export default router;