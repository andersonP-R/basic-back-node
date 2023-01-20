const Category = require("../models/category");
const Product = require("../models/product");
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

const existCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new Error(`Id: ${id} does not exist`);
  }
};

const existProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error(`Id: ${id} does not exist`);
  }
};

module.exports = {
  isValidRole,
  isEmailExist,
  isUserExistById,
  existCategoryById,
  existProductById,
};
