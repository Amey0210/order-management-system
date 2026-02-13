# Real-Time Order Management System

A full stack, event-driven application providing users with live order tracking updates via WebSockets. This project demonstrates seamless state synchronization between a distributed backend and a reactive frontend.

---

## Key Features

* **Real-Time Tracking:** Leverages **Socket.io** for instant status updates (Preparing → Out for Delivery → Delivered) without manual page refreshes.
* **Persistent Sessions:** Utilizes **LocalStorage** to maintain order tracking continuity even after browser restarts or page reloads.
* **Minimalist Architecture:** A clean, component-centric frontend design ensuring high performance and simplified maintainability.
* **Environment Aware:** Custom API service layer that dynamically toggles between development and production endpoints.
* **UX Focused:** Implemented a `TeaserDescription` system for the menu to maintain UI consistency and readability.

---

## Technical Stack

* **Frontend:** React.js, Tailwind CSS, Axios, Socket.io-client
* **Backend:** Node.js, Express.js, Socket.io
* **Database:** MongoDB (Atlas) for persistent order lifecycles
* **Deployment:** Vercel (Frontend) & Render (Backend)

---

## Project Structure

```text
├── client/
│   ├── src/
│   │   ├── api.js             # Centralized API & Environment logic
│   │   ├── App.jsx            # Main routing and global layout
│   │   ├── MenuPage.jsx       # Primary landing page for food discovery
│   │   ├── MenuDisplay.jsx    # Menu grid with Teaser logic
│   │   ├── CheckOutForm.jsx   # Transaction handling & Order placement
│   │   ├── OrderStatus.jsx    # Real-time tracking & Socket listener
│   │   └── OrderHistory.jsx   # User's past orders and status records
└── server/
    ├── index.js               # Server entry & Socket.io initialization
    ├── controllers/           # Order simulation & Business logic
    ├── models/                # MongoDB schemas (Order/Menu)
    └── routes/                # Express API 
```

---

## Installation and Setup


### 1. Clone the repository:
   ```bash
   git clone [https://github.com/Amey0210/order-management-system.git](https://github.com/Amey0210/order-management-system.git)
   ```

### 2. Install dependencies:

#### Backend:
```bash
cd server && npm install
```
#### Frontend:
```bash
cd client && npm install
```

### 3. Environment Variables:
Create a `.env` file in the `server` folder:
```javascript
MONGO_URI=your_mongodb_uri
PORT=5000
```

### 4. Run the App:

#### Backend: `npm start`

#### Frontend: `npm run dev`

---

## Live Demo links

* **Frontend:** [https://order-management-system-navy-six.vercel.app](https://order-management-system-navy-six.vercel.app)
* **Backend API:** [https://order-management-system-zjhg.onrender.com](https://order-management-system-zjhg.onrender.com)


---

## Development Insights

- **Challenge:** Managing "Cold Starts" on free-tier hosting (Render) which can delay initial WebSocket handshakes.

- **Solution:** Implemented a backend-readiness check in the frontend to ensure the socket connection only initiates once the server instance is fully active.

- **AI Collaboration:** Utilized AI tools for generating robust data validation schemas and troubleshooting cross-origin (CORS) security policies during the production deployment phase.