const { response } = require("express");
const Category = require("../models/category");

// obtener categorias - paginado - total - populate
const getCategories = async (req, res = response) => {
  const { from = 0, limit } = req.query;
  const query = { status: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      // populate busca mediante relaciones en la db. En este caso estamos condicionando que devuelva que user creo la categoria
      // mas en la documentación oficial de mongoose
      .populate("user", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.status(200).json({
    status: "success",
    total,
    categories,
  });
};

// obtener categoria - populate {}
const getOneCategory = async (req, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", "name");
  res.status(200).json(category);
};

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({ name });
  if (categoryDB) {
    return res.status(400).json({
      status: "error",
      message: `Category: ${categoryDB.name} already exists`,
    });
  }

  // Generar la data a guardar
  const data = {
    name,
    user: req.user._id,
  };

  const category = new Category(data);
  await category.save();

  res.status(201).json(category);
};

// actualizar categoria
const updateCategory = async (req, res = response) => {
  const { id } = req.params;

  // extraemos lo que no necesitamos del req.body. Por seguridad
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  //   manejar el error para las categorias duplicadas. Si existe una categoria con el mismo nombre devolver un error para
  // que no se quede trabado el back
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  res.status(200).json({
    status: "success",
    category,
  });
};

// borrar categoria - estado: false
const deleteCategory = async (req, res = response) => {
  const { id } = req.params;
  const categoryDeleted = await Category.findByIdAndUpdate(
    id,
    { status: false }, // no lo borramos fisicamente de la db para mantener las relaciones que este doc tenía
    { new: true }
  );

  res.status(200).json({
    status: "success",
    categoryDeleted,
  });
};

module.exports = {
  createCategory,
  getCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
};
