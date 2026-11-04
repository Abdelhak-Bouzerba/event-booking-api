import express from "express";
import eventController from "../controllers/event.controller.js";
import asyncHandler from "express-async-handler";
import validateJWT from "../middlewares/validateJWT.js";
import {requireRole} from "../middlewares/requireRole.js";
import { bookingLimiter } from "../middlewares/limiter.js";

const router = express.Router();

//List upcoming events
//Route GET /api/events
//Access Public
router.get("/", asyncHandler(eventController.listUpcomingEvents));

//Get an event's details
//Route GET /api/events/:eventId
//Access Public
router.get("/:eventId", asyncHandler(eventController.getEventDetails));

//Create a new event
//Route POST /api/events
//Access Private (Organizer only)
router.post("/", validateJWT, requireRole("organizer"), asyncHandler(eventController.createEvent));

//Update an event
//Route PATCH /api/events/:eventsId
//Access Private (event organizer only)
router.patch("/:eventId", validateJWT, requireRole("organizer"), asyncHandler(eventController.updateEvent));

//Delete an event
//Route DELETE /api/events/:eventsId
//Access Private (event organizer only)
router.delete("/:eventId", validateJWT, requireRole("organizer"), asyncHandler(eventController.deleteEvent));

//Book seats for an event
//Route POST /api/events/:eventId/bookings
//Access Private (Attendee only)
router.post("/:eventId/bookings", bookingLimiter, validateJWT, requireRole("attendee"), asyncHandler(eventController.bookSeats));

export default router;