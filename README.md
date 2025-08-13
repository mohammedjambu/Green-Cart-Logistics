# GreenCart Logistics - Delivery Simulation & KPI Dashboard

## 1. Project Overview & Purpose

**GreenCart Logistics** is a full-stack web application built as an internal tool for a eco-friendly delivery company. The application serves as a powerful dashboard for managers to simulate delivery operations and analyze the impact of staffing and scheduling decisions on key performance indicators (KPIs) like profitability and efficiency.

The tool allows managers to:
-   **Manage Core Data:** Perform full CRUD (Create, Read, Update, Delete) operations on drivers, routes, and orders.
-   **Run Dynamic Simulations:** Input parameters such as the number of available drivers and maximum work hours to run a delivery simulation.
-   **Analyze KPIs:** The simulation engine applies proprietary company rules (e.g., late penalties, high-value bonuses, fuel costs, driver fatigue) to calculate and display critical KPIs.
-   **Visualize Results:** View simulation results on an interactive dashboard with charts for On-Time vs. Late deliveries and a breakdown of fuel costs.
-   **View History:** Access a history of past simulation results to track performance over time.


---

## 2. Live Deployment Links

*   **Live Frontend (Vercel):** `[YOUR_LIVE_FRONTEND_URL]`
*   **Live Backend (Render):** `[YOUR_LIVE_BACKEND_URL]`

---

## 3. Tech Stack

This project was built using the MERN stack with a focus on modern development practices.

#### **Backend:**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (hosted on MongoDB Atlas)
*   **ODM:** Mongoose
*   **Authentication:** JSON Web Tokens (JWT)
*   **Testing:** Jest

#### **Frontend:**
*   **Library:** React.js (with Hooks)
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **State Management:** React Hooks (`useState`, `useEffect`)
*   **API Communication:** Axios
*   **Charting:** Chart.js with `react-chartjs-2`
*   **UI Components:** `react-modal`, `heroicons`

#### **Deployment:**
*   **Backend:** Render
*   **Frontend:** Vercel
*   **Database:** MongoDB Atlas

---

## 4. Local Setup Instructions

Follow these steps to run the project on your local machine.

### **Prerequisites:**
*   Node.js (v18 or later recommended)
*   npm or yarn
*   Git

### **Setup Steps:**

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/mohammedjambu/Green-Cart-Logistics]
    cd [Green-Cart-Logistics]
    ```

2.  **Setup Backend:**
    *   Navigate to the backend directory:
        ```bash
        cd Backend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `backend` folder and add the required environment variables (see below).
    *   Run the database seeding script to populate the database with initial data:
        ```bash
        node seed.js
        ```
    *   Start the backend server:
        ```bash
        nodemon app.js
        ```
    The backend will be running on `http://localhost:5000`.

3.  **Setup Frontend:**
    *   Open a new terminal and navigate to the frontend directory:
        ```bash
        cd Frontend
        ```
    *   Install dependencies:
        ```bash
        npm install
        ```
    *   Create a `.env` file in the `frontend` folder and add the required environment variable (see below).
    *   Start the frontend development server:
        ```bash
        npm run dev
        ```
    The frontend will be running on `http://localhost:5173` (or the port specified by Vite).

---

## 5. Environment Variables

You will need to create `.env` files in both the `backend` and `frontend` directories.

#### **Backend (`/backend/.env`):**

#### **Frontend (`/frontend/.env`):**
*Note: For production, a `.env.production` file should be created in the frontend with `VITE_API_URL` pointing to the live Render backend URL.*

---

## 6. API Documentation

The API provides endpoints for authentication, data management (CRUD), and running simulations. All protected routes require a `Bearer <token>` in the `Authorization` header.

**Authentication**
*   **`POST /api/auth/register`**: Register a new manager.
*   **`POST /api/auth/login`**: Log in a manager and receive a JWT.

**Drivers**
*   **`GET /api/drivers`**: Get a list of all drivers.
*   **`POST /api/drivers`**: Create a new driver.
*   **`PUT /api/drivers/:id`**: Update an existing driver.
*   **`DELETE /api/drivers/:id`**: Delete a driver.

**Routes**
*   **`GET /api/routes`**: Get a list of all routes.
*   **`POST /api/routes`**: Create a new route.
*   **`PUT /api/routes/:id`**: Update an existing route.
*   **`DELETE /api/routes/:id`**: Delete a route.

**Orders**
*   **`GET /api/orders`**: Get a list of all orders.
*   **`POST /api/orders`**: Create a new order.
*   **`PUT /api/orders/:id`**: Update an existing order.
*   **`DELETE /api/orders/:id`**: Delete an order.

**Simulation**
*   **`POST /api/simulate`**: Run a new delivery simulation.
    *   **Request Body:**
        ```json
        {
          "num_drivers": 10,
          "max_hours": 8
        }
        ```
    *   **Success Response (201):**
        ```json
        {
            "_id": "63f7b9c4a...",
            "totalProfit": 12345.67,
            "efficiencyScore": 85.7,
            "onTimeDeliveries": 42,
            "lateDeliveries": 7,
            "totalFuelCost": 2500,
            "fuelCostByTraffic": { "Low": 1000, "Medium": 800, "High": 700 },
            "createdAt": "2023-02-23T18:00:04.288Z",
            "updatedAt": "2023-02-23T18:00:04.288Z"
        }
        ```
*   **`GET /api/simulate/history`**: Get a list of all past simulation results, sorted newest first.
