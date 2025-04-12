// import studentRoute from './router/studentRoute.js'

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors")

// Connect to Database
connectDB();

const app = express();

app.use(express.json())
app.use(cors());

app.get('/', async (request, response) => {
  return response.status(200).send("Backend is working!")
})

app.use('/login', require('./router/loginRoute.js'));

app.use('/students', require("./router/studentRoute.js"))
app.use('/leaveform', require("./router/leaveRoute.js"))
app.use('/hostel', require("./router/hostelRoute.js"))
app.use('/faculty', require("./router/facultyRoute.js"))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
