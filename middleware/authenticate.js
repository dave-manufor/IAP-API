const { isValidKey } = require("../controllers/keyController");

const authenticate = async (req, res, next) => {
  try {
    const apiKey = req.header("x-api-key");
    if (!apiKey) {
      res.status(401).send({ error: true, message: "API key required" });
      return;
    }
    const isValid = await isValidKey(apiKey);
    if (isValid) {
      next();
    } else {
      res.status(401).send({ error: true, message: "Invalid API Key" });
    }
  } catch (error) {
    console.trace(error.message);
  }
};

module.exports = authenticate;
