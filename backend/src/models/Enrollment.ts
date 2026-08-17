import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Enrollment extends Model {
  declare id: number;
  declare studentId: number;
  declare courseId: number;
  declare status: string;
}

Enrollment.init(
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    tableName: "enrollments",
    timestamps: true,
  }
);
