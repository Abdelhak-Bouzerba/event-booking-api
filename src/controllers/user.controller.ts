import { Request, Response } from "express";
import userService from "../services/user.service.js";
import { ApiError } from "../middlewares/errorHandler.js";


//Get user Profile
const getUserProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError("User ID not found in request", 400, "USER_ID_NOT_FOUND");
    }

    //Call get user profile service
    const user = await userService.getUserProfile(userId);

    //send response
    res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: { user }
    });

};

//Get user bookings
const getUserBookings = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    //Call get user bookings service
    const bookings = await userService.getUserBookings(Number(userId));

    //send response
    res.status(200).json({
        success: true,
        message: "User bookings fetched successfully",
        data: { bookings }
    });

};

//Delete a booking
const deleteBooking = async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const userId = req.user?.id;

    //Call delete booking service
    await userService.deleteBooking(Number(bookingId), Number(userId));

    //send response
    res.status(200).json({
        success: true,
        message: "Booking deleted successfully"
    });

};

export default {
    getUserProfile,
    getUserBookings,
    deleteBooking
};
