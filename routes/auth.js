const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth");
const { validateFields } = require("../middlewares/validate-fields");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email field is required").isEmail(),
    check("pass", "Password field is required").not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "Id token is required").not().isEmpty(), validateFields],
  googleSignIn
);

module.exports = router;
