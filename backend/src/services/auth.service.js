const prisma = require("./prisma");

/**
 * Login / lookup by email ONLY
 */
const findUserByEmailOrUsername = async (email) => {
  return prisma.user.findUnique({
    where: {
      email: email
    }
  });
};

/**
 * Used by /user-by-email endpoint
 */
const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email: email
    }
  });
};

/**
 * Create user
 */
const createUser = async (data) => {
  return prisma.user.create({ data });
};

module.exports = {
  findUserByEmailOrUsername,
  findUserByEmail,
  createUser
};
