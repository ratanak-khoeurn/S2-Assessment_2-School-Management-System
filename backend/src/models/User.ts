import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare roleId: number | null;
  declare phone: string | null;
  declare adminNotes: string | null;
  declare professionalTitle: string | null;
  declare officeLocation: string | null;
  declare avatar: string | null;
  declare academicRole: string | null;
  declare subject: string | null;
  declare joinedAt: Date | null;
  declare profilePhotoPath: string | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    professionalTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    officeLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    academicRole: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    joinedAt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    profilePhotoPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);
