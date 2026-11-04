import eventRepository from "../repositories/event.repository.js";
import { ApiError } from "../middlewares/errorHandler.js";
import {
  createEventSchema,
  CreateEventSchemaType,
  updateEventSchema,
  UpdateEventSchemaType,
} from "../validators/event.validator.js";


//List upcoming events service
const listUpcomingEvents = async (page: number, limit: number) => {

    const events = await eventRepository.listUpcomingEvents(page, limit);
    if (!events) {
        throw new ApiError("No upcoming events found", 404, "NO_EVENTS_FOUND");
    }

    return events;

};

//Get an event's details service
const getEventDetails = async (eventId: number) => {
    const event = await eventRepository.getEventDetails(eventId);
    if (!event) {
        throw new ApiError("Event not found", 404, "EVENT_NOT_FOUND");
    }
    return event;

};

//Create a new event Service
const createEvent = async (eventData: CreateEventSchemaType) => {

    //Validate input
    const parseResult = createEventSchema.safeParse(eventData);
    if (!parseResult.success) {
        throw new ApiError(parseResult.error.message, 400, "INVALID_INPUT");
    }
    const data = parseResult.data;

    //Create the new event
    const event = await eventRepository.createEvent(data);
    return event;

};

//Update an event Service
const updateEvent = async (eventId: number, organizerId: number, eventData: UpdateEventSchemaType) => {

    //check if event belongs to the organizer
    const eventCheck = await eventRepository.checkEventOwnership(eventId, organizerId);
    if (!eventCheck) {
        throw new ApiError("you are not the organizer of this event", 404, "NOT_EVENT_OWNER");
    }

    //Validate input
    const parseResult = updateEventSchema.safeParse(eventData);
    if (!parseResult.success) {
        throw new ApiError(parseResult.error.message, 400, "INVALID_INPUT");
    }
    const data = parseResult.data;

    //check the capacity with seats booked later

    //update the event
    const event = await eventRepository.updateEvent(eventId, data);
    if (!event) {
        throw new ApiError("Event not found", 404, "EVENT_NOT_FOUND");
    }

    return event;

};

//Delete an event Service
const deleteEvent = async (eventId: number, organizerId: number) => {

    //check if event belongs to the organizer
    const eventCheck = await eventRepository.checkEventOwnership(eventId, organizerId);
    if (!eventCheck) {
        throw new ApiError("you are not the organizer of this event", 404, "NOT_EVENT_OWNER");
    }

    //check if there are no active bookings for this event later

    //delete the event
    await eventRepository.deleteEvent(eventId);

};


export default {
    listUpcomingEvents,
    getEventDetails,
    createEvent,
    updateEvent,
    deleteEvent
}