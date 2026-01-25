##  Event Management Website

A full-stack Event Management Website built using **HTML, CSS, JavaScript, and Node.js (Express)**.  
The platform allows users to create, manage, and participate in events efficiently.

---

##  Features

###  Authentication
- User Login system
- Credential validation via backend
- JSON-based user storage
- Dashboard access protection

###  Event Management
- Create new events
- View all events
- View event details
- View events created by specific user

###  Participant Management
- Add participants to events
- View participants of an event
- Remove participants

###  Calendar View
- Interactive month/week/day calendar grid powered by FullCalendar
- Color-coded calendar cells based on event status:
  - **Green (`#28a745`)**: Events created by the logged-in user
  - **Blue (`#007bff`)**: Registered events created by others
  - **Orange (`#ff8c42`)**: Events scheduled for today
  - **Red (`#dc3545`)**: Past events
- Category, status (Created/Registered), and time (Upcoming/Past) filter configurations
- Detailed event information popup in modal viewer upon event selection
- Live dashboard counts update based on calendar event statistics

###  Notifications
- Create event notifications
- View all notifications

###  Dashboard
- Total events created
- Total participants across events

---

##  Tech Stack

### Frontend:
- HTML5
- CSS3
- JavaScript (Fetch API, FullCalendar library)

### Backend:
- Node.js
- Express.js
- Mongoose (Object Data Modeling)

### Data Storage & Containerization:
- **Database**: MongoDB (Mongoose models for Users, Events, Participants, Notifications)
- **Containerization**: Docker (multi-stage environment deployment)
- **CI/CD**: Jenkins declarative pipeline

---
