import eventRepository from "../repositories/event.repository.js";
import bookingRepository from "../repositories/bookingRepository.js";
import { ApiError } from "../middlewares/errorHandler.js";
import {
  createEventSchema,
  CreateEventSchemaType,
  updateEventSchema,
  UpdateEventSchemaType,
  bookSeatsSchema,
} from "../validators/event.validator.js";
import userRepository from "../repositories/user.repository.js";
import { withRemainingSeats } from "../utils/setRemainingSeats.js";

//List upcoming events service
const listUpcomingEvents = async (page: number, limit: number) => {
  const events = await eventRepository.listUpcomingEvents(page, limit);
  if (!events) {
    throw new ApiError("No upcoming events found", 404, "NO_EVENTS_FOUND");
  }

  return Promise.all(events.map(withRemainingSeats));
}

//Get an event's details service
const getEventDetails = async (eventId: number) => {
  const event = await eventRepository.getEventDetails(eventId);
  if (!event) {
    throw new ApiError("Event not found", 404, "EVENT_NOT_FOUND");
  }
  return withRemainingSeats(event);
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
const updateEvent = async (eventId: number,organizerId: number,eventData: UpdateEventSchemaType) => {
  //check if event belongs to the organizer
  const eventCheck = await eventRepository.checkEventOwnership(
    eventId,
    organizerId,
  );
  if (!eventCheck) {
    throw new ApiError(
      "you are not the organizer of this event",
      404,
      "NOT_EVENT_OWNER",
    );
  }

  //Validate input
  const parseResult = updateEventSchema.safeParse(eventData);
  if (!parseResult.success) {
    throw new ApiError(parseResult.error.message, 400, "INVALID_INPUT");
  }
  const data = parseResult.data;

  //check the capacity with seats booked
  const totalBookedSeats = await bookingRepository.getTotalBookedSeats(eventId);
  if (data.capacity && data.capacity < totalBookedSeats) {
    throw new ApiError(
      "New capacity cannot be less than the total booked seats",
      400,
      "INVALID_CAPACITY",
    );
  }

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
  const eventCheck = await eventRepository.checkEventOwnership(
    eventId,
    organizerId,
  );
  if (!eventCheck) {
    throw new ApiError(
      "you are not the organizer of this event",
      404,
      "NOT_EVENT_OWNER",
    );
  }

  //check if there are no active bookings for this event
  const activeBookings = await bookingRepository.getTotalBookedSeats(eventId);
  if (activeBookings && activeBookings > 0) {
    throw new ApiError(
      "Cannot delete event with active bookings",
      400,
      "ACTIVE_BOOKINGS_EXIST",
    );
  }

  //delete the event
  await eventRepository.deleteEvent(eventId);
};

//Book seats for an event Service
const bookSeats = async (eventId: number, userId: number, seatsToBook: number) => {
    
  //validate input
  const parseResult = bookSeatsSchema.safeParse({eventId,userId,seatsToBook});
  if (!parseResult.success) {
    throw new ApiError(parseResult.error.message, 400, "INVALID_INPUT");
  }
  const data = parseResult.data;

  //check if event exists
  const event = await eventRepository.getEventDetails(data.eventId);
  if (!event) {
    throw new ApiError("Event not found", 404, "EVENT_NOT_FOUND");
  }

    //check if the event already started
    const currentDate = new Date();
    const eventDate = new Date(event.startsAt);
    if(eventDate < currentDate) {
        throw new ApiError("Cannot book seats for an event that has already started", 400, "EVENT_ALREADY_STARTED");
    }

  //check if user already have booked on this event
  const existingBooking = await userRepository.getUserBooking(userId);
  if (existingBooking) {
    throw new ApiError(
      "you have already booked for this event",
      400,
      "ALREADY_BOOKED",
    );
  }

  //check if there are enough seats available
  const totalBookedSeats = await bookingRepository.getTotalBookedSeats(
    data.eventId,
  );
  const availableSeats = event.capacity - totalBookedSeats;
  if (availableSeats < data.seatsToBook) {
    throw new ApiError("Not enough seats available", 409, "NOT_ENOUGH_SEATS");
  }

  //book the seats
  await bookingRepository.bookSeats(eventId, userId, seatsToBook);
};

export default {
  listUpcomingEvents,
  getEventDetails,
  createEvent,
  updateEvent,
  deleteEvent,
  bookSeats,
};
