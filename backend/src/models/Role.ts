import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Role extends Model {
  declare id: number;
  declare roleName: string;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "roles",
    timestamps: true,
  }
);
