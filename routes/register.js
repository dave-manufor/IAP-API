const express = require("express");
const router = express.Router();
const { isValidEmail } = require("../helper");
const { getUser, createUser } = require("../controllers/userController");

router.post("/", async (req, res) => {
  const data = req.body;
  console.log(data);
  //   CHECK IF ALL PROPERTIES ARE SET
  if (!data.firstname || !data.lastname || !data.email || !data.password) {
    res
      .status(400)
      .json({ error: true, message: "Body is missing one or more attributes" });
    return;
  }
  //   CHECK IF EMAIL IS VALID
  if (!isValidEmail(data.email)) {
    res.status(400).json({ error: true, message: "Invalid Email Address" });
    return;
  }

  //   CHECK IF USER IS ALREADY REGISTERED
  const user = await getUser(data.email);
  if (user) {
    res.status(400).json({
      error: true,
      message: `User already registered with ${data.email}`,
    });
    return;
  }

  // REGISTER NEW USER
  const newUser = await createUser(data);
  if (newUser) {
    res.status(200).json({ error: false, user: { ...newUser } });
    return;
  } else {
    res.status(500).json({ error: true, message: "Unable to create new user" });
  }
});

module.exports = router;
