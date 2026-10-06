import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        mobileNumber: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        organization: {
            type: String,
            required: true,
            trim: true,
        },

        personToMeet: {
            type: String,
            required: true,
            trim: true,
        },

        purposeOfVisit: {
            type: String,
            required: true,
            trim: true,
        },

        visitDateTime: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["Checked In", "Checked Out"],
            default: "Checked In",
        },
    },
    {
        timestamps: true,
    }
);

const Visitor = mongoose.model("Visitor", visitorSchema);

export default Visitor;