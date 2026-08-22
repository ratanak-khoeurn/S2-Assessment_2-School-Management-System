import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Attendance extends Model {
  declare id: number;
  declare studentId: number;
  declare courseId: number;
  declare date: string;
  declare status: "Present" | "Absent" | "Late" | "Excused";
  declare remarks: string | null;
}

Attendance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Late", "Excused"),
      allowNull: false,
      defaultValue: "Present",
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "attendances",
    timestamps: true,
  }
);
