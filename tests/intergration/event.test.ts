import request from "supertest";
import app from "../../src/app";
import createEvent from "../factories/event.factory";
import createUser from "../factories/user.factory";
import { generateJwtAccessToken } from "../../src/utils/jwt";

describe("Event API ", () => {
    it("should return 200 ok and list events", async () => {
        const res = await request(app).get("/api/events");
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("events");
    });

    it("should organizer edit their own event", async () => {
        const organizer = await createUser({ role: "organizer" });
        const event = await createEvent(organizer.id);
        const token = generateJwtAccessToken({
            id: organizer.id,
            email: organizer.email,
            role: organizer.role,
        });

        const res = await request(app)
            .patch(`/api/events/${event.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({title: "Updated Event"});

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("event");
        expect(res.body.data.event.title).toBe("Updated Event");
    });

    it("should not an organizer edit someone else's event", async () => {
        const eventOwner = await createUser({
            role: "organizer",
            email: "event-owner@example.com",
        });
        const otherOrganizer = await createUser({
            role: "organizer",
            email: "other-organizer@example.com",
        });
        const event = await createEvent(eventOwner.id);
        const token = generateJwtAccessToken({
            id: otherOrganizer.id,
            email: otherOrganizer.email,
            role: otherOrganizer.role,
        });

        const res = await request(app)
            .patch(`/api/events/${event.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Event",
            });

        expect(res.status).toBe(403);
        expect(res.body.error).toHaveProperty("code" , "NOT_EVENT_OWNER");

    });
});