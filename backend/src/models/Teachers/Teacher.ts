import { DataTypes, Model, Optional } from "sequelize";

import { sequelize } from "../../config/database.js";

// =====================================================
// TEACHER ATTRIBUTES
// =====================================================

export interface TeacherAttributes {
  id: number;

  teacherId: string;

  name: string;

  email: string;

  phone: string;

  gender: "Male" | "Female" | "Other";

  departmentId: number;

  position: string;

  qualification: string | null;

  joinedDate: string | null;

  status: "active" | "inactive";

  createdAt?: Date;

  updatedAt?: Date;
}

// =====================================================
// CREATE ATTRIBUTES
// =====================================================

export interface TeacherCreationAttributes extends Optional<
  TeacherAttributes,
  "id" | "qualification" | "joinedDate" | "status" | "createdAt" | "updatedAt"
> {}

// =====================================================
// TEACHER MODEL
// =====================================================

export class Teacher
  extends Model<TeacherAttributes, TeacherCreationAttributes>
  implements TeacherAttributes
{
  declare id: number;

  declare teacherId: string;

  declare name: string;

  declare email: string;

  declare phone: string;

  declare gender: "Male" | "Female" | "Other";

  declare departmentId: number;

  declare position: string;

  declare qualification: string | null;

  declare joinedDate: string | null;

  declare status: "active" | "inactive";

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

// =====================================================
// INIT
// =====================================================

Teacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    teacherId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "teacher_id",
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
      defaultValue: "Male",
    },

    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "department_id",
    },

    position: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Teacher",
    },

    qualification: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    joinedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "joined_date",
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },

  {
    sequelize,

    tableName: "teachers",

    timestamps: true,

    underscored: true,
  },
);
