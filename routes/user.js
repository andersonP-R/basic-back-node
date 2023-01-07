const { Router } = require("express");
const { check } = require("express-validator");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const {
  isValidRole,
  isEmailExist,
  isUserExistById,
} = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");
const router = Router();

router.get("/", getUsers);

router.put(
  "/:id",
  [
    check("id", "Not a valid id").isMongoId(),
    check("id").custom(isUserExistById),
    validateFields,
  ],
  updateUser
);

router.post(
  "/",
  check("email", "Email not valid").isEmail(),
  check("email").custom(isEmailExist),
  check("name", "Name field is required").not().isEmpty(),
  check("pass", "Pass field is required and more than 6 characters").isLength({
    min: 6,
  }),
  check("role").custom(isValidRole), // también funcióna .custom((role) => isValidRole(role))
  validateFields,
  createUser
);

router.delete(
  "/:id",
  [
    check("id", "Not a valid id").isMongoId(),
    check("id").custom(isUserExistById),
  ],
  validateFields,
  deleteUser
);

module.exports = router;
