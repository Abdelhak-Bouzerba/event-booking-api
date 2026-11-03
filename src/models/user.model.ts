import sequelize from "../config/db.js";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Model,
} from "sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare role: "orgnaizer" | "attendee";
  declare createdAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmpty: false,
        len: [8, 50],
      },
    },
    role: {
      type: DataTypes.ENUM("orgnaizer", "attendee"),
      allowNull: false,
      validate: {
        isIn: [["orgnaizer", "attendee"]],
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
  },
  {
    sequelize,
    tableName: "users",
  },
);
