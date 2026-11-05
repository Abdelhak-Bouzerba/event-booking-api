import request from "supertest";
import app from "../../src/app";
import createUser from "../factories/user.factory";
import createEvent from "../factories/event.factory";
import createBooking from "../factories/booking.factory";
import { generateJwtAccessToken } from "../../src/utils/jwt";

describe("Booking API", () => {
    it("should create a new booking", async () => {
        const attendee = await createUser({ role: "attendee" });
        const organizer = await createUser({ role: "organizer" });
        const event = await createEvent(organizer.id, { title: "mformatik event", capacity: 30 });
        const accessToken = generateJwtAccessToken({
            id: attendee.id,
            email: attendee.email,
            role: attendee.role,
        });

        const res = await request(app)
            .post(`/api/events/${event.id}/bookings`)
            .set("Authorization", "Bearer " + accessToken)
            .send({ seatsToBook: 3 });

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            success: true,
            message: "Seats booked successfully",
        });
    });

    it("should fail when the event is full", async () => {
        const attendee = await createUser({ role: "attendee" });
        const organizer = await createUser({ role: "organizer" });
        const event = await createEvent(organizer.id, { title: "mformatik event", capacity: 4 });
        const accessToken = generateJwtAccessToken({
            id: attendee.id,
            email: attendee.email,
            role: attendee.role,
        });

        await createBooking(attendee.id, event.id, { seats: 4 });

        const res = await request(app)
            .post(`/api/events/${event.id}/bookings`)
            .set("Authorization", "Bearer " + accessToken)
            .send({eventId: event.id, userId: attendee.id ,seatsToBook: 1 });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error.code).toBe("EVENT_FULL");
    });

    it("should return 409 conflict when not enough seats are available", async () => {
        const attendee = await createUser({ role: "attendee" });
        const organizer = await createUser({ role: "organizer" });
        const event = await createEvent(organizer.id, { title: "mformatik event", capacity: 4 });
        const accessToken = generateJwtAccessToken({
            id: attendee.id,
            email: attendee.email,
            role: attendee.role,
        });

        const res = await request(app)
            .post(`/api/events/${event.id}/bookings`)
            .set("Authorization", "Bearer " + accessToken)
            .send({ seatsToBook: 5 });

        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error.code).toBe("NOT_ENOUGH_SEATS");
    });

    it("should frees seats when a booking is canceled", async () => {
        const attendee = await createUser({ role: "attendee" });
        const organizer = await createUser({ role: "organizer" });
        const event = await createEvent(organizer.id, { title: "mformatik event", capacity: 10 });
        const booking = await createBooking(attendee.id, event.id, { seats: 5 });
        const accessToken = generateJwtAccessToken({
            id: attendee.id,
            email: attendee.email,
            role: attendee.role,
        });

        const res = await request(app)
          .delete(`/api/users/me/bookings/${booking.id}`)
          .set("Authorization", "Bearer " + accessToken);

        expect(res.status).toBe(200);
        expect(event.capacity).toBe(10);   
    });
});
