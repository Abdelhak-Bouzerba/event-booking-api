import Event from "../../src/models/event.model";
import { InferCreationAttributes } from "sequelize";

type EventOverrides = Partial<InferCreationAttributes<Event>>;

let eventCounter = 0;

const createEvent = async (
  organizerId: number,
  overrides: EventOverrides = {},
): Promise<Event> => {
  eventCounter++;

  return Event.create({
    organizerId,
    title: `Test Event ${eventCounter}`,
    description: "An event created for integration testing.",
    venue: "Test Venue",
    startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    capacity: 20,
    ...overrides,
  });
};

export default createEvent;
