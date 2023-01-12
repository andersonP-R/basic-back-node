const { response, json } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, img, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    // si no existe lo creamos
    if (!user) {
      const data = {
        name,
        email,
        pass: "@",
        img,
        role: "user",
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    // Si el user en DB no esta activo
    if (!user.status) {
      return res.status(401).json({
        status: "Error action",
        message: "User not active, communicate with admin",
      });
    }

    // Generar el jwt
    const token = await generateJWT(user.id);

    res.status(201).json({
      status: "ok",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "Error action",
      message: "Token not verified",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
