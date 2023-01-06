const { Router } = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const router = Router();

router.get("/", getUsers);

router.put("/:id", updateUser);

router.post("/", createUser);

router.delete("/", deleteUser);

module.exports = router;
