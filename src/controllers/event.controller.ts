import { Request, Response } from "express";
import eventService from "../services/event.service.js";
import { ApiError } from "../middlewares/errorHandler.js";


//List upcoming events
const listUpcomingEvents = async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;

    //call list upcoming events service
    const events = await eventService.listUpcomingEvents(pageNum, limitNum);

    //return response
    res.status(200).json({
        success: true,
        message: "Upcoming events fetched successfully",
        data: { events }
    });

};

//Get an event's details 
const getEventDetails = async (req: Request, res: Response) => {
    const { eventId } = req.params;

    //call get event details service
    const event = await eventService.getEventDetails(Number(eventId));

    //send response
    res.status(200).json({
        success: true,
        message: "Event details fetched successfully",
        data: { event }
    });

};

//Create a new event 
const createEvent = async (req: Request, res: Response) => {
    const eventData = req.body;

    //check if eventData is provided
    if (!eventData || eventData.length === 0) {
        throw new ApiError("Event data is required", 400, "INVALID_INPUT");
    }

    //call create event service
    const event = await eventService.createEvent(eventData);

    //send response
    res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: { event }
    });

};

//Update an event
const updateEvent = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const organizerId = req.user?.id;
    const eventData = req.body;

    //check if eventData is provided
    if (!eventData || eventData.length === 0) {
        throw new ApiError("Event data is required", 400, "INVALID_INPUT");
    }

    //Call update event Service
    const event = await eventService.updateEvent(Number(eventId), organizerId!, eventData);

    //send response
    res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: { event }
    });

};

//delete an event
const deleteEvent = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const organizerId = req.user?.id;

    //check if eventId is provided
    if (!eventId) {
        throw new ApiError("Event ID is required", 400, "INVALID_INPUT");
    }

    //Call delete event Service
    await eventService.deleteEvent(Number(eventId), organizerId!);

    //send response
    res.status(200).json({
        success: true,
        message: "Event deleted successfully"
    });

};

//Book seats for an event
const bookSeats = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const userId = req.user?.id;
    const { seatsToBook } = req.body;

    //check if seatsToBook is provided
    if (!seatsToBook || seatsToBook <= 0) {
        throw new ApiError("Seats to book must be provided", 400, "INVALID_INPUT");
    }

    //Call book seats Service
    await eventService.bookSeats(Number(eventId), userId!, seatsToBook);

    //send response
    res.status(200).json({
        success: true,
        message: "Seats booked successfully"
    });
    
};

export default {
    listUpcomingEvents,
    getEventDetails,
    createEvent,
    updateEvent,
    deleteEvent,
    bookSeats
}