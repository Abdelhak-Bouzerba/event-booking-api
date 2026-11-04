import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";


//Get user profile
const getUserProfile = async (userId: number) => {
    const user = await User.findByPk(userId, {
        attributes: ["id", "name", "email", "role", "createdAt", "updatedAt"]
    });
    return user;
};

//Get user bookings
const getUserBooking = async (userId: number) => {
    const bookings = await Booking.findAll({
        where: {
            userId: userId
        },
        order: [["createdAt", "DESC"]],
    });
    return bookings;
    
};

//Get booking details
const getBookingDetails = async (bookingId: number) => {
    const booking = await Booking.findByPk(bookingId);
    return booking;
};

//Delete a booking
const deleteBooking = async (bookingId: number) => {
    await Booking.destroy({
        where: {
            id: bookingId
        }
    });
};


export default {
    getUserProfile,
    getUserBooking,
    getBookingDetails,
    deleteBooking
};