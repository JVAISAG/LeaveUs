
# LeaveUs Backend

The **LeaveUs Backend** serves as the core server-side component of the LeaveUs application, managing API endpoints, database interactions, and leave application logic to support the frontend interface.

## 📁 Project Structure

```
backend/
├── models/            # Defines database schemas and models
├── router/            # API route definitions
├── middleware/        # Custom middleware functions
├── config/            # Configuration files (e.g., database, environment)
└── server.js          # Entry point to start the server
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/CyberPidgi/LeaveUs.git
   cd LeaveUs/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Create a `.env` file in the `backend` directory and add the following:

   ```env
   PORT=5000  (or any port of your choice)
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<randomly_generated_key>
   ```

4. **Start the server:**

   Ensure within `package.json` file, the `scripts` contains the following command:
   ```
   "dev": "nodemon server.js --env-file=.env"
   ```

   Then run the following command in a new terminal:
   ```bash
   npm run dev
   ```

   The server should now be running at `http://localhost:5000` (the port specified in your .env file).

## 📦 API Endpoints

### /students
- `GET /all` – Get all the students within the college
- `GET /:id` – Get the student with the requested `mongodb` id
- `GET /:id/leaveforms` – Retrieve all leave requests associated with the student
- `POST /:id/leaveform/edit/:leaveId` – Edit the requested leaveform
- `POST /:id/delete` – Delete the required student
- `POST /new` – Create a new student by passing request body

### /faculty
- `GET /all` – Get all the faculties within the college
- `GET /:id` – Get the faculty with the requested `mongodb` id
- `GET /:id/leaveforms` – Retrieve all leave requests that require approval from the faculty
- `POST /new` – Create a new faculty by passing request body

### /leaveform
- `GET /all` – Get all the leaveforms created
- `POST /new` – Create a new leaveform by passing request body
- `POST /:id/approve` – Approve the particular leaveform
- `POST /:id/reject` – Reject the particular leaveform
- `POST /:id/delete` – Delete the particular leaveform

### /hostel
- `GET /all` – Get all the hostels
- `POST /new` – Create a new hostel by passing request body

## 🛠 Technologies Used

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT** – JSON Web Tokens for authentication
- **dotenv** – Environment variable management

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

