import sequelize from "../config/db.js";
import {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  DataTypes,
} from "sequelize";

class Booking extends Model<
  InferAttributes<Booking>,
  InferCreationAttributes<Booking>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare eventId: number;
  declare seats: number;
  declare status: "active" | "cancelled";
  declare createdAt: CreationOptional<Date>;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "events",
        key: "id",
      },
    },
    seats: {
      type: DataTypes.NUMBER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    status: {
      type: DataTypes.ENUM("active", "cancelled"),
      allowNull: false,
      validate: {
        isIn: [["active", "cancelled"]],
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
    tableName: "bookings",
  },
);

export default Booking;
