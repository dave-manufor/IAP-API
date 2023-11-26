const express = require("express");
const { getPatients, getPatient } = require("../controllers/patientController");
const { getDrugs } = require("../controllers/drugController");
const router = express.Router();
const { isDigits } = require("../helper");

router.get("/", async (req, res) => {
  let users = null;
  const queries = req.query;
  if (Object.keys(queries).length > 0) {
    if (
      !(
        queries.gender ||
        queries.drug ||
        queries.purchase_date ||
        queries.last_login
      )
    ) {
      res.status(400).send({ error: true, message: "Invalid query string" });
      return;
    }
    if (queries.gender) {
      users = await getPatients("gender", queries.gender);
    } else if (queries.drug) {
      if (!isDigits(queries.drug)) {
        res
          .status(400)
          .json({ error: true, message: "Drug query expects an integer" });
        return;
      }
      users = await getPatients("drug", Number(queries.drug));
    } else if (queries.purchase_date) {
      const purchaseDate = new Date(queries.purchase_date);
      if (isNaN(purchaseDate.getTime())) {
        res
          .status(400)
          .json({ error: true, message: "Purchase date query expects a date" });
        return;
      }
      users = await getPatients("purchase_date", purchaseDate);
    } else if (queries.last_login) {
      const loginDate = new Date(queries.last_login);
      if (isNaN(loginDate.getTime())) {
        res
          .status(400)
          .json({ error: true, message: "Last login query expects a date" });
        return;
      }
      users = await getPatients("last_login", loginDate);
    }
    res.status(200).json(users);
    return;
  }
  users = await getPatients();
  res.status(200).json(users);
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const user = await getPatient(userId);
  res.status(200).json({ user: user });
});

router.get("/:userId/drugs", async (req, res) => {
  let drugs = null;
  const userId = req.params.userId;
  if (!isDigits(userId)) {
    // Check if user ID is not all digits
    res.status(400).json({
      error: true,
      message: "Invalid user ID. User ID expects an integer",
    });
    return;
  }
  drugs = await getDrugs("user", Number(userId));
  res.status(200).json(drugs);
});

module.exports = router;
