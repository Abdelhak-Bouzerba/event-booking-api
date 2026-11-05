import Booking from "../../src/models/booking.model";
import { InferCreationAttributes } from "sequelize";

type BookingOverrides = Partial<InferCreationAttributes<Booking>>;

const createBooking = async (
  userId: number,
  eventId: number,
  overrides: BookingOverrides = {},
): Promise<Booking> => {
  return Booking.create({
    userId,
    eventId,
    seats: 1,
    status: "active",
    ...overrides,
  });
};

export default createBooking;
