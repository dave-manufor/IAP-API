const express = require("express");
const cors = require("cors"); // CROSS ORIGIN REQUEST
const bodyParser = require("body-parser"); // FORMATS REQUEST BODY TO JSON
const { users, drugs, register } = require("./routes");
const authenticate = require("./middleware/authenticate");
const PORT = 4000;

// SETUP
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ROUTES

app.get("/", (req, res) => {
  res.status(200).send("Connection to server successful");
});

app.use("/users", authenticate, users);
app.use("/drugs", drugs);
app.use("/register", register);

// SERVER INIT
app.listen(PORT, (error) => {
  if (error) {
    console.log("Failed to start server");
    console.log(error.message);
  } else {
    console.log(`Listening on port ${PORT}`);
  }
});
