import bookingRepository from "../repositories/bookingRepository.js";



export const withRemainingSeats = async (event: {
  id: number;
  capacity: number;
  toJSON: () => object;
}) => {
  const totalBookedSeats =
    (await bookingRepository.getTotalBookedSeats(event.id)) ?? 0;

  return {
    ...event.toJSON(),
    remainingSeats: Math.max(event.capacity - totalBookedSeats, 0),
  };
};