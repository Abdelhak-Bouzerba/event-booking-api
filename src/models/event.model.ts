import sequelize from "../config/db.js";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  DataTypes,
} from "sequelize";

class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
> {
  declare id: CreationOptional<number>;
  declare organizerId: number;
  declare title: string;
  declare description: string;
  declare venue: string;
  declare startsAt: Date;
  declare capacity: number;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 100],
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    venue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString(),
      },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    tableName: "events",
    timestamps: true,
  },
);

export default Event;
