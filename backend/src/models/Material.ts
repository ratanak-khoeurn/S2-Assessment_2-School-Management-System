import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Material extends Model {
  declare id: number;
  declare title: string;
  declare description: string | null;
  declare filePath: string | null;
  declare courseId: number;
}

Material.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "materials",
    timestamps: true,
  }
);
