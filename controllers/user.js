const { response, request } = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");

//
const getUsers = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;

  // La prop "status" del modelo de User se usa para no borrar directamente el usuario, solo se cambia el valor de la prop por
  // ejemplo a false para decirle al front o los demas servicios que consuman el api rest que el usuario esta inactivo.
  // Luego usamos el query para devolver (.find(query)) todos los documenentos basados en esa propiendad.
  const query = { status: true };

  // query parameters para paginación. .skip(): desde que doc queremos. .limit(): cuantos docs queremos
  // const users = await User.find(query).skip(Number(from)).limit(Number(limit));

  // Devolvemos todos los docs que esten activos.
  // const totalUsers = await User.countDocuments(query);

  // Promise.all para resolver las dos promesas de arriba en simultaneo y aumentar la eficiencia en la respuesta.
  // Desestructuramos el array. El primer valor (totalUsers) de la desestructuración  accede a la primera posición del array
  // (totalUsers)
  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    status: "success",
    total,
    users,
  });
};

//
const createUser = async (req, res = response) => {
  const { name, pass, email, role } = req.body;
  const user = new User({
    name,
    email,
    pass,
    role,
  });

  // encriptar pass
  const salt = bcryptjs.genSaltSync(); // definimos cuantas vueltas de hashing queremos para encriptar la pass
  user.pass = bcryptjs.hashSync(pass, salt);

  await user.save();

  res.json({
    status: "success",
    user,
  });
};

//
const deleteUser = async (req, res = response) => {
  const { id } = req.params;

  // Podriamos eliminarlo fisicamente de la DB, aqui se hace mediante la actualización de su propiedad "status" para manter los
  // posibles registros que este user haya hecho o modificado. Se recomiendo hacerlo así para mantener la integridad de la
  // información.

  const user = await User.findByIdAndUpdate(id, { status: false });

  res.json({
    status: "success",
    user,
  });

  // De cualquier manera si se desea se puede eliminar de la manera tradicinal con un .findByIdAndDelete()
};

//
const updateUser = async (req, res = response) => {
  const { id } = req.params;
  const { _id, pass, google, email, ...otherProps } = req.body;

  if (pass) {
    // encriptar pass
    const salt = bcryptjs.genSaltSync();
    otherProps.pass = bcryptjs.hashSync(pass, salt);
  }

  const userDb = await User.findByIdAndUpdate(id, otherProps, { new: true });

  res.json({
    status: "success",
    userDb,
  });
};

//
module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
};
