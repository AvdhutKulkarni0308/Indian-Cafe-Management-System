# Chai Theory – Indian Cafe Management System

A modern web application for managing an Indian cafe’s menu, orders, and customer experience.

## Features

- Interactive menu with categories (Hot/Cold Beverages, Snacks, Desserts)
- Shopping cart and order placement
- Admin panel for menu and order management
- Responsive design for desktop and mobile
- Location and contact info

## Technologies Used

- Frontend: HTML, CSS (custom + Tailwind-like), JavaScript
- Backend: Node.js, Express, MongoDB, Mongoose

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB

### Installation

1. **Clone the repository:**
   ```sh
   https://github.com/AvdhutKulkarni0308/Indian-Cafe-Management-System.git
   cd <repo-name>
   ```

2. **Install backend dependencies:**
   ```sh
   cd backend
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in `backend/` with:
     ```
     PORT=5000
     MONGO_URI=<your-mongodb-uri>
     ```

4. **Start the backend server:**
   ```sh
   npm run dev
   ```
   The server runs at [http://localhost:5000](http://localhost:5000).

5. **Open the frontend:**
   - Open `frontend/index.html` in your browser for the customer view.
   - Open `frontend/admin.html` for the admin panel.

## Folder Structure

```
frontend/    # Frontend HTML/CSS/JS files
backend/     # Backend code (Express, MongoDB)
README.md    # Project documentation
```

## Usage

- **Customer:** Browse menu, add items to cart, place orders.
- **Admin:** Login with default credentials (`admin` / `chai123`), manage menu items and view/delete orders.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

Made with ❤️ in India.


