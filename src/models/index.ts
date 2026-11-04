import User from "./user.model.js";
import Event from "./event.model.js";
import Booking from "./booking.model.js";

//Associate models
User.hasMany(Event, {
    foreignKey: "organizerId",
    as: "events"
});
User.hasMany(Booking, {
    foreignKey: "userId",
    as: "bookings"
});

Event.belongsTo(User, {
    foreignKey: "organizerId",
    as: "organizer"
});

Booking.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});