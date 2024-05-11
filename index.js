const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const dotend = require("dotenv");

// Load the environment variables
dotend.config();

// Enable CORS
app.use(cors());

// Enable JSON body parsing
app.use(express.json());

// Define the main route
app.get("/", (req, res) => {
  res.send("The server is running!");
});

// Connect to the database
try {
  mongoose.connect(process.env.URL);
  console.log("Connected to the database");
} catch (error) {
  console.log("Could not connect to the database");
}

// Define the app routes
const authRoute = require("./routes/Auth.routes");
const booksRoute = require("./routes/Books.routes");
const ordersRoute = require("./routes/Orders.routes");
const usersRoute = require("./routes/Users.routes");

app.use("/auth", authRoute);
app.use("/books", booksRoute);
app.use("/orders", ordersRoute);
app.use("/users", usersRoute);

// Start the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
