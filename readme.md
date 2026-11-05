# Event Booking API

A TypeScript/Express API for user authentication, organizer-managed events, and attendee bookings. It uses MySQL with Sequelize.

## Requirements

- Node.js 20+ and npm
- MySQL 8+
- typescript 5.9.3+
- Docker and Docker Compose (optional, but recommended for local MySQL)

## Installation

```bash
npm install
Copy-Item .env.example .env
```

Update `.env` with the MySQL connection details and a strong `JWT_SECRET`. For a typical local database:

```dotenv
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=event_booking
DB_PASSWORD=event_booking_password
DB_NAME=event_booking
TEST_DB_NAME=event_booking_test
JWT_SECRET=replace_with_a_long_random_secret
```

## Database and migrations

Create the configured databases and ensure MySQL is running, then apply migrations:

```bash
npx sequelize-cli db:migrate --env development
```

To undo the latest migration:

```bash
npx sequelize-cli db:migrate:undo --env development
```

### Docker Compose

Docker Compose starts MySQL and the API container. Set `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `JWT_SECRET` in `.env`, then run:

```bash
docker compose up --build
```

The API is available at `http://localhost:3000`.

## Running the server

Development mode:

```bash
npm run dev
```

Production-style local run:

```bash
npm run build
npm start
```

## Running tests

Tests use the database named by `TEST_DB_NAME`. Create that database, set `NODE_ENV=test` when running migrations, and then run:

```bash
$env:NODE_ENV="test"
npx sequelize-cli db:migrate --env test
npm test
```

The test setup cleans the test database before each test. Never point `TEST_DB_NAME` at a development or production database.

## API examples

The examples assume the server is running at `http://localhost:3000`. Save tokens from the registration or login response and use them as `Bearer` tokens.

### Register an attendee

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "mformatik user",
    "email": "user@example.com",
    "password": "secure-password",
    "role": "attendee"
  }'
```

### Register an organizer and log in

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Event Organizer",
    "email": "organizer@example.com",
    "password": "secure-password",
    "role": "organizer"
  }'

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@example.com",
    "password": "secure-password"
  }'
```

### Create an event

Replace `<organizer-token>` and `<organizer-id>` with values from the authenticated organizer.

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer <organizer-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "organizerId": <organizer-id>,
    "title": "TypeScript Community Meetup",
    "description": "A practical evening about building reliable TypeScript services.",
    "venue": "intro to AI",
    "startsAt": "2026-12-01T10:00:00.000Z",
    "capacity": 50
  }'
```

### List and inspect events

```bash
curl http://localhost:3000/api/events
curl http://localhost:3000/api/events/<event-id>
```

### Book seats as an attendee

```bash
curl -X POST http://localhost:3000/api/events/<event-id>/bookings \
  -H "Authorization: Bearer <attendee-token>" \
  -H "Content-Type: application/json" \
  -d '{ "seatsToBook": 2 }'
```

### Read the current user and bookings

```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <token>"

curl http://localhost:3000/api/users/me/bookings \
  -H "Authorization: Bearer <attendee-token>"
```

### Update an event

Only the organizer who owns the event can update it:

```bash
curl -X PATCH http://localhost:3000/api/events/<event-id> \
  -H "Authorization: Bearer <organizer-token>" \
  -H "Content-Type: application/json" \
  -d '{ "title": "Updated TypeScript Community Meetup" }'
```

## Assumptions and future improvements

- MySQL is the required persistence layer; SQLite or an in-memory database was not introduced.
- Registration accepts the organizer role because organizers need to create events.
- JWTs are returned directly in the response and are expected to be sent in the `Authorization` header.
- Event creation currently accepts `organizerId` from the authenticated JWT.
- More time would be used to add stronger request schemas for every controller, transaction/locking protection around concurrent seat bookings, API documentation with OpenAPI, and broader coverage for update/delete, cancellation, rate limits, and database failure cases.
- Waitlist. When an event is full, attendees can join a waitlist; a cancellation offers the seat to the first person waiting.

## AI assistance

AI tools were used as development aids to simplify and clarify confusing concepts, particularly parts of the test configuration and Docker setup. I also used explanations from LLM, including ChatGPT and Claude, to better understand implementation options and troubleshoot issues.

## Approximate time spent

Roughly 4–5 hours each for 3 days, including planning , initialization , implementation, integration-test debugging, and documentation.
