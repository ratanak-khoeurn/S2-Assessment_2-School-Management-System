import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Course extends Model {
  declare id: number;
  declare courseName: string;
  declare department: string;
  declare description: string | null;
  declare capacity: number;
  declare schedule: string;
  declare room: string;
  declare syllabusPath: string | null;
  declare enrollmentCode: string | null;
  declare teacherId: number | null;
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    schedule: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Mon, Wed, Fri 10:00 AM - 11:30 AM",
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Auditorium B-12",
    },
    syllabusPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    enrollmentCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "courses",
    timestamps: true,
  }
);
