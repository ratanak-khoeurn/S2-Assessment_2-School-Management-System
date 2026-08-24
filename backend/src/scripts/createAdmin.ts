// Bootstraps or promotes an admin user for the /admin panel.
// Usage: npm run seed:admin -- <email> <password> [name]
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { sequelize } from "../config/database.js";
import { Role, User } from "../models/index.js";

dotenv.config();

async function main() {
    const [email, password, name] = process.argv.slice(2);

    if (!email || !password) {
        console.error("Usage: npm run seed:admin -- <email> <password> [name]");
        process.exitCode = 1;
        return;
    }

    await sequelize.authenticate();

    const [adminRole] = await Role.findOrCreate({ where: { roleName: "admin" } });
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
            name: name ?? email.split("@")[0],
            email,
            password: hashedPassword,
            roleId: adminRole.id,
        },
    });

    if (!created) {
        user.set({ password: hashedPassword, roleId: adminRole.id });
        await user.save();
        console.log(`Promoted existing user "${email}" to admin.`);
    } else {
        console.log(`Created admin user "${email}".`);
    }

    await sequelize.close();
}

main().catch((error) => {
    console.error("Failed to seed admin user:", error);
    process.exitCode = 1;
});
