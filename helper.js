const { v4: uuidv4 } = require("uuid");

// Generates API Key using uuid
const genAPIKey = () => {
  const uuid = uuidv4();
  const APIKey = uuid.split("-").join("");
  return APIKey;
};

// Checks if string is a valid email
const isValidEmail = (email) => {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return email.match(validRegex);
};

// Checks if string has digits only
const isDigits = (digits) => {
  return digits.match("^[0-9]+$");
};

module.exports = { genAPIKey, isValidEmail, isDigits };
