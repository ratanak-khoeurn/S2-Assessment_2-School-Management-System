// Seeds baseline data: standard roles and a default admin account.
// Usage: npm run seed
// Override the default admin via .env: SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { sequelize } from "../config/database.js";
import { Role, User } from "../models/index.js";

dotenv.config();

const ROLE_NAMES = ["admin", "teacher", "student"];

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@school.local";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "System Admin";

async function main() {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    const roles: Record<string, Role> = {};
    for (const roleName of ROLE_NAMES) {
        const [role] = await Role.findOrCreate({ where: { roleName } });
        roles[roleName] = role;
        console.log(`Role ready: ${roleName}`);
    }

    const [admin, created] = await User.findOrCreate({
        where: { email: ADMIN_EMAIL },
        defaults: {
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: await bcrypt.hash(ADMIN_PASSWORD, 10),
            roleId: roles.admin.id,
        },
    });

    if (!created && admin.roleId !== roles.admin.id) {
        admin.set({ roleId: roles.admin.id });
        await admin.save();
    }

    console.log(created ? "Default admin user created." : "Default admin user already exists.");
    console.log(`  email:    ${ADMIN_EMAIL}`);
    if (created) {
        console.log(`  password: ${ADMIN_PASSWORD}`);
        console.log("  Change this password after first login.");
    }

    await sequelize.close();
}

main().catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
});
