import { sequelize } from "../config/database.js";
import { Role } from "./Role.js";
import { User } from "./User.js";
import { Course } from "./Course.js";
import { Enrollment } from "./Enrollment.js";
import { Material } from "./Material.js";
import {Teacher} from "../models/Teachers/Teacher.js";

import {Department} from "./Department/Department.js";
// Role & User
Role.hasMany(User, { foreignKey: "roleId" });
User.belongsTo(Role, { foreignKey: "roleId" });

// Teacher & Course
User.hasMany(Course, { foreignKey: "teacherId", as: "TaughtCourses" });
Course.belongsTo(User, { foreignKey: "teacherId", as: "Teacher" });

// Student & Course (Many-to-Many through Enrollment)
User.belongsToMany(Course, {
  through: Enrollment,
  foreignKey: "studentId",
  otherKey: "courseId",
  as: "EnrolledCourses",
});
Course.belongsToMany(User, {
  through: Enrollment,
  foreignKey: "courseId",
  otherKey: "studentId",
  as: "Students",
});

// Direct Enrollment associations
User.hasMany(Enrollment, { foreignKey: "studentId" });
Enrollment.belongsTo(User, { foreignKey: "studentId", as: "Student" });

Course.hasMany(Enrollment, { foreignKey: "courseId" });
Enrollment.belongsTo(Course, { foreignKey: "courseId", as: "Course" });

// Course & Materials
Course.hasMany(Material, { foreignKey: "courseId", as: "Materials" });
Material.belongsTo(Course, { foreignKey: "courseId", as: "Course" });
Teacher.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
});

/* =====================================================
   DEPARTMENT -> TEACHERS
===================================================== */

Department.hasMany(Teacher, {
  foreignKey: "department_id",
  as: "teachers",
});

export { sequelize, Role, User, Course, Enrollment, Material, Teacher, Department };
