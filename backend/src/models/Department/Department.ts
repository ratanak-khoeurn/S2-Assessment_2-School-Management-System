import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database.js";

interface DepartmentAttributes {
  id: number;
  departmentCode: string;
  departmentName: string;
  description: string | null;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

interface DepartmentCreationAttributes extends Optional<
  DepartmentAttributes,
  "id" | "description" | "status" | "createdAt" | "updatedAt"
> {}

export class Department
  extends Model<DepartmentAttributes, DepartmentCreationAttributes>
  implements DepartmentAttributes
{
  declare id: number;
  declare departmentCode: string;
  declare departmentName: string;
  declare description: string | null;
  declare status: "active" | "inactive";

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    departmentCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: "department_code",
    },

    departmentName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "department_name",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    tableName: "departments",
    timestamps: true,
    underscored: true,
  },
);
