const { PrismaClient, patients_gender } = require("@prisma/client");
const prisma = new PrismaClient();
const { isDigits } = require("../helper");

const getPatient = async (query) => {
  let patient = null;
  let options = {};
  if (isDigits(query)) {
    options = {
      where: {
        patient_id: Number(query),
      },
    };
  } else {
    options = {
      where: {
        patient_email: query.toString(),
      },
    };
  }

  try {
    const result = await prisma.patients.findFirst(options);
    if (result) {
      patient = result;
    }
  } catch (error) {
    console.trace(error.message);
  } finally {
    return patient;
  }
};

const isValidGender = (gender) => {
  return Object.keys(patients_gender).includes(gender);
};

const getPatients = async (searchBy = "", query = null) => {
  let patients = [];
  let options = null;
  switch (searchBy) {
    case "gender":
      const gender = query.toString().toUpperCase();
      if (!isValidGender(gender)) return [];
      options = {
        where: {
          gender: patients_gender[gender],
        },
      };
      break;
    case "drug":
      options = {
        where: {
          prescriptions: {
            some: {
              drug_id: query,
            },
          },
        },
      };
      break;
    case "purchase_date":
      options = {
        where: {
          prescriptions: {
            some: {
              created_on: {
                gte: query.toISOString(),
              },
            },
          },
        },
      };
      break;
    case "last_login":
      options = {
        where: {
          last_login: {
            gte: query.toISOString(),
          },
        },
      };
      break;
    default:
      options = {};
      break;
  }

  try {
    const query = await prisma.patients.findMany(options);
    if (query.length > 0) {
      patients = query;
    }
  } catch (error) {
    console.trace(error.message);
  } finally {
    return patients;
  }
};

module.exports = { getPatient, getPatients };
