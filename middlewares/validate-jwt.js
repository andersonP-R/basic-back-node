const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }

  try {
    // mejorar este código, nos estamos buscando a nosotros mismos literalmente en la db por que estamos usando el token de
    // nuestra propia sesión; osea que usuario test1 inicia sesión, entra a la ruta de borrar users, esta ruta pide en los headers
    // un el token del user que inicia sesión (test1) y ese token es el que se obtiene en los headers de este middleware.

    // aqui obtenemos ese uid que retorna el token y al final es con el cual hacemos la busqueda. Osea: nos buscamos a nosotros
    // mismos por que el uid es del token con el que test1 inició sesión.
    // Se prodira presindir de pedir un token de acceso ya que si estamos justo en la ruta de eliminar usuarios, articulos, etc,.
    // sabemos que de por si ya deberias estar autenticado y que tengas rol de admin, etc,.

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        message: "User does not exists",
      });
    }

    // Verificar si el uid tiene status en true
    if (!user.status) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = validateJWT;
