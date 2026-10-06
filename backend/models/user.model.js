import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ── Schema ──────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            // Never send the password field back in queries
            select: false,
        },

        role: {
            type: String,
            enum: ["admin", "receptionist", "employee"],
            default: "receptionist",
        },
    },
    {
        timestamps: true,
    }
);

// ── Hash password before saving ──────────────────────────────────────
userSchema.pre("save", async function () {
    // Only hash when the password field is new or changed
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance method: compare passwords ───────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// ── Never return the password in toJSON ───────────────────────────────
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
