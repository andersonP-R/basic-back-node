const { response } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generateJWT");

const login = async (req, res = response) => {
  const { email, pass } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "Action error",
        message: "Email not found",
      });
    }

    // verificar estado del usuario
    if (!user.status) {
      return res.status(400).json({
        status: "Action error",
        message: "User not active",
      });
    }

    const validPass = bcryptjs.compareSync(pass, user.pass);
    if (!validPass) {
      return res.status(400).json({
        status: "Action error",
        message: "Incorrect password",
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      status: "success",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Action error",
    });
  }
};

module.exports = {
  login,
};
