# Eneba Software Engineer Intern Homework Assignment

This project is a web application created as part of the Eneba Software Engineer Intern application process.

The application allows users to search for games, view prices and discounts, filter by platform and region, add games to a cart, and manage a wishlist.

---

## Tech Stack

### Frontend
- React (Vite)
- JavaScript
- CSS

### Backend
- Node.js
- Express
- SQLite (SQL database)

---

## Features

- Game search using `/list?search=<gamename>`
- Platform and region filtering
- Sorting by price
- Wishlist functionality
- Cart with quantity controls
- Discount display
- Persistent state using LocalStorage
- SQL database backend

---

## Project Structure

eneba-internship-task/
├── backend/
│ ├── index.js
│ ├── db.js
│ ├── games.db
│ ├── package.json
│ └── package-lock.json
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ ├── package-lock.json
│ └── vite.config.js
│
├── README.md
└── AI_PROMPTS.md
---

## How to Run the Project Locally

### 1. Run the Backend

Open a terminal (Command Prompt / PowerShell / VS Code terminal), then:

```bash
cd backend
npm install
node index.js

Backend will run at:
http://localhost:5000

Run the frontend
Open another terminal then:
cd frontend
npm install
npm run dev

Frontend will run at :
http://localhost:5173


API Endpoints

GET /list
GET /list?search=<gamename>

Notes

This project is for demonstration purposes only.
Checkout is UI-only.
node_modules folders are intentionally excluded.


Author: Ahammad Yazeem
