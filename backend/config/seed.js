import User from "../models/user.model.js";

/**
 * Seed initial users if none exist in the database
 */
export const seedInitialUsers = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            console.log("No users found. Seeding initial admin and receptionist accounts...");

            await User.create([
                {
                    name: "Admin User",
                    email: "admin@visitordesk.com",
                    password: "admin123",
                    role: "admin",
                },
                {
                    name: "Reception Desk",
                    email: "reception@visitordesk.com",
                    password: "reception123",
                    role: "receptionist",
                },
            ]);

            console.log("Initial users seeded successfully:");
            console.log("   Admin: admin@visitordesk.com / admin123");
            console.log("   Reception: reception@visitordesk.com / reception123");
        }
    } catch (error) {
        console.error("Error seeding initial users:", error.message);
    }
};

export default seedInitialUsers;
