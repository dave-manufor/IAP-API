const { PrismaClient, drugs_category } = require("@prisma/client");
const { isDigits } = require("../helper");
const prisma = new PrismaClient();

const getDrugs = async (searchBy = "", query = null) => {
  let drugs = [];
  let options = null;
  switch (searchBy) {
    case "category":
      const category = query.toString().toUpperCase();
      if (!isValidCategory(category)) return [];
      options = {
        where: {
          category: drugs_category[category],
        },
      };
      break;
    case "user":
      options = {
        where: {
          prescriptions: {
            some: {
              patient_id: query,
            },
          },
        },
      };
      break;
    default:
      options = {};
      break;
  }

  try {
    const query = await prisma.drugs.findMany(options);
    if (query.length > 0) {
      drugs = query;
    }
  } catch (error) {
    console.trace(error.message);
  } finally {
    return drugs;
  }
};

const isValidCategory = (category) => {
  return Object.keys(drugs_category).includes(category);
};

const getDrug = async (query) => {
  let drug = null;
  let options = {};
  if (isDigits(query)) {
    options = {
      where: {
        drug_id: Number(query),
      },
    };
  } else {
    options = {
      where: {
        drug_name: query.toString(),
      },
    };
  }

  try {
    const result = await prisma.drugs.findFirst(options);
    if (result) {
      drug = result;
    }
  } catch (error) {
    console.trace(error.message);
  } finally {
    return drug;
  }
};

module.exports = { getDrugs, getDrug };
