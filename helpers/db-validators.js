const Role = require("../models/role");
const User = require("../models/user");

const isValidRole = async (role = "") => {
  const roleInDb = await Role.findOne({ role });
  if (!roleInDb) {
    throw new Error(`${role} is not a valid role`);
  }
};

// verificar si el correo existe
const isEmailExist = async (email = "") => {
  const emailInDb = await User.findOne({ email });
  if (emailInDb) {
    throw new Error(`Email ${email} is already in use`);
  }
};

const isUserExistById = async (id) => {
  const userExist = await User.findById(id);
  if (!userExist) {
    throw new Error(`Id: ${userExist} does not exist`);
  }
};

module.exports = {
  isValidRole,
  isEmailExist,
  isUserExistById,
};
