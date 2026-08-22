import { sequelize, Role, User } from "./models/index.js";

export const seedDatabase = async () => {
  try {
    console.log("Resetting and syncing MySQL database...");
    await sequelize.sync({ force: true });

    const [adminRole, teacherRole, studentRole] = await Promise.all([
      Role.create({ roleName: "admin" }),
      Role.create({ roleName: "teacher" }),
      Role.create({ roleName: "student" }),
    ]);

    await User.create({
      name: "Admin User",
      email: "admin@school.edu",
      password: "password123",
      roleId: adminRole.id,
      phone: "012 111 222",
      academicRole: "admin",
    });

    await User.create({
      name: "Teacher Sok Dara",
      email: "teacher@school.edu",
      password: "password123",
      roleId: teacherRole.id,
      phone: "012 345 678",
      academicRole: "teacher",
      subject: "Computer Science",
      professionalTitle: "Senior Lecturer",
      officeLocation: "Building A - Room 101",
      joinedAt: new Date("2023-01-15"),
    });

    await User.create({
      name: "Student Chan Vathanak",
      email: "student@school.edu",
      password: "password123",
      roleId: studentRole.id,
      phone: "012 889 900",
      academicRole: "student",
      subject: "Computer Science",
      joinedAt: new Date("2023-09-01"),
      adminNotes: "Year 3 Student",
    });

    console.log("✅ Database seeded with 1 Admin, 1 Teacher, and 1 Student!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedDatabase();
