import userRepository from "../repositories/user.repository.js";
import { ApiError } from "../middlewares/errorHandler.js";
import eventRepository from "../repositories/event.repository.js";

//Get user Profile
const getUserProfile = async (userId: number) => {

    //validate userId
    if (!userId || userId <= 0) {
        throw new ApiError("Invalid user ID", 400, "INVALID_USER_ID");
    }

    //check if user exists
    const user = await userRepository.getUserProfile(userId);
    if (!user) {
        throw new ApiError("User not found", 404, "USER_NOT_FOUND");
    }

    return user;

};

//Get user bookings
const getUserBookings = async (userId: number) => {

    //check if user exists
    const user = await userRepository.getUserProfile(userId);
    if (!user) {
        throw new ApiError("User not found", 404, "USER_NOT_FOUND");
    }

    //get user bookings
    const bookings = await userRepository.getUserBookings(userId);
    return bookings;

};


//Cancel a booking
const cancelBooking = async (bookingId: number, userId: number) => { 

    //check if booking exists
    const booking = await userRepository.getBookingDetails(bookingId);
    if (!booking) {
        throw new ApiError("Booking not found", 404, "BOOKING_NOT_FOUND");
    }

    //check if booking belongs to the user
    if (booking.userId !== userId) {
        throw new ApiError("You don't have access to delete this booking", 403, "UNAUTHORIZED");
    }

    //cancel the booking
    await userRepository.cancelBooking(bookingId);

    //Free up the booked seats
    const event = await eventRepository.getEventDetails(booking.eventId);
    if (event) {
        event.capacity += booking.seats;
        await eventRepository.updateEvent(event.id, { capacity: event.capacity });
    } else { 
        throw new ApiError("Event not found for the booking", 404, "EVENT_NOT_FOUND");
    }

};


export default {
  getUserProfile,
  getUserBookings,
  cancelBooking,
};