const express = require("express");
const router = express.Router();
const { isValidEmail } = require("../helper");
const { getUser, createUser } = require("../controllers/userController");

router.get("/", async (req, res) => {
  const data = req.body;
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
  console.log(`User: ${user}`);
  if (user) {
    res.status(400).json({
      error: true,
      message: `User already registered with ${data.email}`,
    });
    return;
  }

  // REGISTER NEW USER
  const newUser = await createUser(data);
  console.log(`New User: ${newUser}`);
  if (newUser) {
    res.status(200).json({ error: false, user: { ...newUser } });
    return;
  } else {
    res.status(500).json({ error: true, message: "Unable to create new user" });
  }
});

module.exports = router;
