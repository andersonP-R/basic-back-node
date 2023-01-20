const { Router } = require("express");
const { check } = require("express-validator");
const {
  createCategory,
  getCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const { existCategoryById } = require("../helpers/db-validators");
const { validateFields } = require("../middlewares/validate-fields");
const validateJWT = require("../middlewares/validate-jwt");
const { validateRole } = require("../middlewares/validate-role");

const router = Router();

// Obtener todas las categorias - publico
router.get("/", getCategories);

// Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "Invalid MONGO id").isMongoId(),
    check("id").custom(existCategoryById),
    validateFields,
  ],
  getOneCategory
);

// Crear categoria - privado - cualquier persona con un token válido
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name field is required").not().isEmpty(),
    validateFields,
  ],
  createCategory
);

// Actualizar categoria - privado - cualquier persona con un token válido
router.put(
  "/:id",
  [
    validateJWT,
    check("name", "Name field is required").not().isEmpty(),
    check("id").custom(existCategoryById),
    validateFields,
  ],
  updateCategory
);

// Borrar una categoria - admin
router.delete(
  "/:id",
  [
    validateJWT,
    validateRole,
    check("id", "Invalid MONGO id").isMongoId(),
    check("id").custom(existCategoryById),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
