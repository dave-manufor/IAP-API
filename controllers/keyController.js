const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CHECKS IF KEY IS VALID
const isValidKey = async (key) => {
  let isValid = false;
  try {
    // CHECK FOR KEY IN DATABASE
    const apiKey = await prisma.api_keys.findFirst({
      where: {
        key: key,
      },
    });
    // IF KEY IS FOUND THEN ITS' VALID
    if (apiKey) {
      isValid = true;
    }
  } catch (error) {
    console.trace(error.message);
  } finally {
    return isValid;
  }
};

module.exports = { isValidKey };
