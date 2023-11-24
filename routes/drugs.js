const express = require("express");
const { getDrugs, getDrug } = require("../controllers/drugController");
const { isDigits } = require("../helper");
const router = express.Router();

router.get("/", async (req, res) => {
  let drugs = null;
  const queries = req.query;
  if (Object.keys(queries).length > 0) {
    // IF there are any querires
    if (!(queries.category || queries.user)) {
      // IF query is not 'category' or 'user'
      res.status(400).send({ error: true, message: "Invalid query string" });
      return;
    }
    if (queries.category) {
      // IF category is queried
      drugs = await getDrugs("category", queries.category);
    } else if (queries.user) {
      // IF user is queried
      if (!isDigits(queries.user)) {
        // Check if user query is not all digits
        res
          .status(400)
          .json({ error: true, message: "User query expects an integer" });
        return;
      }
      drugs = await getDrugs("user", Number(queries.user));
    }
    res.status(200).json(drugs);
    return;
  }
  // IF no query return all drugs
  drugs = await getDrugs();
  res.status(200).json(drugs);
});

router.get("/:drugId", async (req, res) => {
  const drugId = req.params.drugId;
  const drug = await getDrug(drugId);
  res.status(200).json({ drug: drug });
});

module.exports = router;
