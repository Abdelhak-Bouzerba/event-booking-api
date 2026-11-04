import express from "express";
import userController from "../controllers/user.controller.js";
import asyncHandler from "express-async-handler";
import validateJWT from "../middlewares/validateJWT.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = express.Router();

//Get user profile
//Route GET /api/users/me
//Access Private (Authenticated users only)
router.get("/me" , validateJWT, asyncHandler(userController.getUserProfile));

//Get user bookings
//Route GET /api/users/me/bookings
//Access Private (Authenticated users only)
router.get("/me/bookings", validateJWT, requireRole("attendee"), asyncHandler(userController.getUserBookings));

//Cancel a booking
//Route DELETE /api/users/me/bookings/:bookingId
//Access Private (Booking owner only)
router.delete("/me/bookings/:bookingId", validateJWT, requireRole("attendee"), asyncHandler(userController.cancelBooking));


export default router;