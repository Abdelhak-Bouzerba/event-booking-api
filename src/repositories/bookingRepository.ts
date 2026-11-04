import Booking from "../models/booking.model.js";


//Book seats for an event
const bookSeats = async (eventId: number,userId: number,seatsToBook: number) => {
  await Booking.create({
    eventId,
    userId,
    seats: seatsToBook,
    status: "active",
  });
};

//Get the total booked seats for an event
const getTotalBookedSeats = async (eventId: number) => {
    const totalSeats = await Booking.sum("seats", {
        where: {
            eventId: eventId,
            status: "active",
        },
    });
    return totalSeats;

};

export default {
    bookSeats,
    getTotalBookedSeats,
}