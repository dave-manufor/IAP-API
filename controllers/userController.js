const { PrismaClient } = require("@prisma/client");
const { genAPIKey } = require("../helper");
const prisma = new PrismaClient();

const getUser = async (id, useId = true) => {
  let user = null;
  try {
    if (useId) {
      user = await prisma.api_users.findUnique({
        where: {
          email: String(id),
        },
      });
    } else {
      user = await prisma.api_users.findUnique({
        where: {
          id: Number(id) || 0,
        },
      });
    }
  } catch (error) {
    console.trace(error.message);
  } finally {
    return user;
  }
};

const createUser = async (data) => {
  let newUser = null;
  const apiKey = genAPIKey();
  try {
    const user = await prisma.api_users.create({
      data: {
        fname: data.firstname,
        lname: data.lastname,
        email: data.email,
        password: data.password,
        api_keys: { create: { key: apiKey } },
      },
    });
    if (user) {
      // ADD API KEY TO OBJECT
      newUser = { firstname: user.fname, lastname: user.lname, key: apiKey };
    }
  } catch (error) {
    console.trace(error.message);
  } finally {
    return newUser;
  }
};

module.exports = { getUser, createUser };
