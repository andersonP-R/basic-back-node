const { response } = require("express");
const Product = require("../models/product");

// obtener categorias - paginado - total - populate
const getProducts = async (req, res = response) => {
  const { from = 0, limit } = req.query;
  const query = { status: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      // populate busca mediante relaciones en la db. En este caso estamos condicionando que devuelva que user creo la categoria
      // mas en la documentación oficial de mongoose
      .populate("user", "name")
      .populate("category", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.status(200).json({
    status: "success",
    total,
    products,
  });
};

// obtener categoria - populate {}
const getOneProduct = async (req, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");
  res.status(200).json(product);
};

const createProduct = async (req, res = response) => {
  const { status, user, ...body } = req.body;

  const productDB = await Product.findOne({ name: body.name });
  if (productDB) {
    return res.status(400).json({
      status: "error",
      message: `Category: ${productDB.name} already exists`,
    });
  }

  // Generar la data a guardar
  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.user._id,
  };

  const product = new Product(data);
  await product.save();

  res.status(201).json(product);
};

// actualizar categoria
const updateProduct = async (req, res = response) => {
  const { id } = req.params;

  // extraemos lo que no necesitamos del req.body. Por seguridad
  const { status, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }

  data.user = req.user._id;

  //   manejar el error para las categorias duplicadas. Si existe una categoria con el mismo nombre devolver un error para
  // que no se quede trabado el back
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  res.status(200).json({
    status: "success",
    product,
  });
};

// borrar categoria - estado: false
const deleteProduct = async (req, res = response) => {
  const { id } = req.params;
  const productDeleted = await Product.findByIdAndUpdate(
    id,
    { status: false }, // no lo borramos fisicamente de la db para mantener las relaciones que este doc tenía
    { new: true }
  );

  res.status(200).json({
    status: "success",
    productDeleted,
  });
};

module.exports = {
  createProduct,
  getProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};