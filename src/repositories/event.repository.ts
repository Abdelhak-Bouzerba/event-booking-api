import { Op } from "sequelize";
import Event from "../models/event.model.js";
import Booking from "../models/booking.model.js";

//Check event organizer ownership
const checkEventOwnership = async (eventId: number, organizerId: number) => {
  const event = await Event.findOne({
    where: {
      id: eventId,
      organizerId: organizerId,
    },
  });
  return event;
};

//List upcoming events with pagination
const listUpcomingEvents = async (page: number, limit: number) => {
  const events = await Event.findAll({
    where: {
      startsAt: {
        [Op.gt]: new Date(),
      },
    },
    order: [["startsAt", "ASC"]],
    offset: (page - 1) * limit,
    limit: limit,
  });
  return events;
};

//Get an event's details
const getEventDetails = async (eventId: number) => {
  const event = await Event.findByPk(eventId);
  return event;
};

//Create a new event
const createEvent = async (eventData: any) => {
  const event = await Event.create(eventData);
  return event;
};

//Update an event
const updateEvent = async (eventId: number, eventData: any) => {
  const event = await Event.findOne({
    where: {
      id: eventId,
    },
  });
  await event?.update(eventData);
  return event;
};

//Delete an event
const deleteEvent = async (eventId: number) => {
  await Event.destroy({
    where: {
      id: eventId,
    },
  });
};


export default {
  checkEventOwnership,
  listUpcomingEvents,
  getEventDetails,
  createEvent,
  updateEvent,
  deleteEvent,
};
