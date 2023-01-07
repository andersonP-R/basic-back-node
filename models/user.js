const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  img: { type: String },
  role: { type: String, required: true, enum: ["admin", "user"] },
  status: { type: Boolean, default: true },
  google: { type: Boolean, default: false },
});

// Sobre escribimos métodos de moongose para, en este caso, al momento de la creación de los users no devolver la
// contraseña por la res.json();

UserSchema.methods.toJSON = function () {
  // extraemos lo que no queremos retornar en la res.json; en este caso: password y __v (versión)
  const { __v, pass, ...user } = this.toObject();
  return user;
};

module.exports = model("User", UserSchema);
