import Visitor from "../models/visitor.js";


// ==========================================
// CREATE VISITOR
// ==========================================

export const createVisitor = async (req, res) => {
    try {
        const {
            name,
            mobileNumber,
            email,
            organization,
            personToMeet,
            purposeOfVisit,
            visitDateTime,
            status,
        } = req.body;

        if (
            !name ||
            !mobileNumber ||
            !email ||
            !organization ||
            !personToMeet ||
            !purposeOfVisit ||
            !visitDateTime
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const visitor = await Visitor.create({
            name,
            mobileNumber,
            email,
            organization,
            personToMeet,
            purposeOfVisit,
            visitDateTime,
            status,
        });

        return res.status(201).json({
            success: true,
            message: "Visitor created successfully",
            data: visitor,
        });

    } catch (error) {
        console.error("Create visitor error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create visitor",
            error: error.message,
        });
    }
};


// ==========================================
// GET ALL VISITORS
// ==========================================

export const getAllVisitors = async (req, res) => {
    try {
        const { search } = req.query;

        let query = {};

        if (search) {
            query = {
                $or: [
                    {
                        name: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    {
                        mobileNumber: {
                            $regex: search,
                            $options: "i",
                        },
                    },
                ],
            };
        }

        const visitors = await Visitor.find(query)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: visitors.length,
            data: visitors,
        });

    } catch (error) {
        console.error("Get visitors error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get visitors",
            error: error.message,
        });
    }
};


// ==========================================
// GET SINGLE VISITOR
// ==========================================

export const getVisitorById = async (req, res) => {
    try {
        const { id } = req.params;

        const visitor = await Visitor.findById(id);

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: visitor,
        });

    } catch (error) {
        console.error("Get visitor error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get visitor",
            error: error.message,
        });
    }
};


// ==========================================
// UPDATE VISITOR
// ==========================================

export const updateVisitor = async (req, res) => {
    try {
        const { id } = req.params;

        const visitor = await Visitor.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Visitor updated successfully",
            data: visitor,
        });

    } catch (error) {
        console.error("Update visitor error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update visitor",
            error: error.message,
        });
    }
};


// ==========================================
// DELETE VISITOR
// ==========================================

export const deleteVisitor = async (req, res) => {
    try {
        const { id } = req.params;

        const visitor = await Visitor.findByIdAndDelete(id);

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Visitor deleted successfully",
            data: visitor,
        });

    } catch (error) {
        console.error("Delete visitor error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete visitor",
            error: error.message,
        });
    }
};


// ==========================================
// UPDATE STATUS
// ==========================================

export const updateVisitorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }

        if (!["Checked In", "Checked Out"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        const visitor = await Visitor.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Visitor status updated successfully",
            data: visitor,
        });

    } catch (error) {
        console.error("Update status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update visitor status",
            error: error.message,
        });
    }
};