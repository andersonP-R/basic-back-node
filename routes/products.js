const { Router } = require("express");
const { check } = require("express-validator");
const validateJWT = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");
const { validateRole } = require("../middlewares/validate-role");

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getOneProduct,
} = require("../controllers/products");
const {
  existProductById,
  existCategoryById,
} = require("../helpers/db-validators");

const router = Router();

// Crear un producto
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name field is required").not().isEmpty(),
    check("category", "Invalid mongo id").isMongoId(),
    validateFields,
  ],
  createProduct
);

// Obtener todos los productos
router.get("/", getProducts);

// Obtener un producto
router.get(
  "/:id",
  [
    check("id", "Invalid MONGO id").isMongoId(),
    check("id").custom(existProductById),
    validateFields,
  ],
  getOneProduct
);

// Actualizar un producto
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "Invalid MONGO id").isMongoId(),
    check("id").custom(existProductById),
    validateFields,
  ],
  updateProduct
);

// Borrar un producto
router.delete(
  "/:id",
  [
    validateJWT,
    validateRole,
    check("id", "Invalid MONGO id").isMongoId(),
    check("id").custom(existProductById),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
