import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../config/database.js";

interface TeacherAttributes {
  id: number;

  teacherId: string;

  name: string;

  email: string;

  phone: string | null;

  gender: "Male" | "Female" | null;

  departmentId: number;

  position: string;

  qualification: string | null;

  joinedDate: Date | null;

  status: "active" | "inactive";

  createdAt?: Date;

  updatedAt?: Date;
}

interface TeacherCreationAttributes extends Optional<
  TeacherAttributes,
  | "id"
  | "phone"
  | "gender"
  | "qualification"
  | "joinedDate"
  | "status"
  | "createdAt"
  | "updatedAt"
> {}

export class Teacher
  extends Model<TeacherAttributes, TeacherCreationAttributes>
  implements TeacherAttributes
{
  declare id: number;

  declare teacherId: string;

  declare name: string;

  declare email: string;

  declare phone: string | null;

  declare gender: "Male" | "Female" | null;

  declare departmentId: number;

  declare position: string;

  declare qualification: string | null;

  declare joinedDate: Date | null;

  declare status: "active" | "inactive";

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;
}

Teacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    teacherId: {
      type: DataTypes.STRING(20),
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
      unique: true,
    },

    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    gender: {
      type: DataTypes.ENUM("Male", "Female"),
      allowNull: true,
    },

    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "department_id",
    },

    position: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    qualification: {
      type: DataTypes.STRING(150),
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
