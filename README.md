# Multi-Vendor Event & Ticket Booking Portal

A full-stack MERN application where event Organizers can list and manage events, and Customers can browse, search, and book ticket slots. The backend strictly enforces ticket availability limits and handles concurrent booking requests safely to prevent overbooking.

## Tech Stack

**Backend:** Node.js, Express, MongoDB (Mongoose), JWT Authentication, bcryptjs, Joi validation

**Frontend:** Next.js (App Router), Redux Toolkit + redux-persist, Tailwind CSS, Axios, react-toastify, lucide-react

## Live Links

- **Frontend:** `https://event-ticket-booking-tan.vercel.app/login`
- **Backend API Base URL:** `https://event-ticket-booking-x4ok.onrender.com/`
- **GitHub Repository:** `https://github.com/sanjayps789/event-ticket-booking.git`

## Project Structure

event-ticket-booking/
├── backend/
│ ├── src/
│ │ ├── config/ # Database connection
│ │ ├── models/ # User, Event, Booking schemas
│ │ ├── controllers/ # Auth, Event, Booking logic
│ │ ├── routes/ # API routes
│ │ ├── middlewares/ # Auth, validation, error handling
│ │ ├── validators/ # Joi schemas
│ │ ├── utils/ # asyncHandler, generateToken
│ │ ├── app.js
│ │ └── server.js
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── app/ # Pages (App Router)
│ │ ├── components/ # Auth forms, event/booking UI, layout
│ │ ├── redux/ # Store, slices, persisted auth state
│ │ ├── services/api/ # Axios instance and API calls
│ │ └── hooks/ # useAuth
│ └── package.json
└── README.md


Run the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`.

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` folder:

NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api


Run the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.


## Sample Environment Variables

### backend/.env

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/event-booking?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_key

## Test User Credentials

Use these to log in directly, or register your own accounts via the Signup page.

| Role      | Email                  | Password |
|-----------|-------------------------|----------|
| ORGANIZER | org1@test.com    | 123456   |
| CUSTOMER  | customer1@gmail.com     | 123456   |

> Note: these accounts must be registered once (via `/register`) on whichever database instance (local or deployed) you're testing against, since each database starts empty.

## API Endpoints

**Auth**
- `POST /api/auth/register` — Register (name, email, password, role)
- `POST /api/auth/login` — Login, returns JWT + user details

**Events**
- `GET /api/events` — List upcoming events (`?category=`, `?search=`, `?page=`, `?limit=`)
- `GET /api/events/:id` — Single event details
- `POST /api/events` — Create event (Organizer only)
- `GET /api/events/organizer/my-events` — Organizer's own events with sales summary
- `GET /api/events/:id/attendees` — Attendee list for an event (Organizer, own events only)

**Bookings**
- `POST /api/events/:id/book` — Book tickets (Customer only, atomic — prevents overbooking)
- `GET /api/bookings/my-bookings` — Customer's own bookings

## Key Design Notes

- **Overbooking prevention:** Ticket booking uses MongoDB's `findOneAndUpdate` with an atomic filter-and-decrement operation (`availableTickets: { $gte: requestedTickets }` combined with `$inc`), so concurrent booking requests cannot oversell tickets.
- **Auth:** Passwords are hashed with bcrypt; JWTs carry the user's role, which is verified server-side on every protected route — client-supplied role claims are never trusted for authorization.
- **Session persistence:** Auth state (token + user) is persisted via `redux-persist` using `sessionStorage`, so a page refresh keeps the user logged in within the same browser tab/session.