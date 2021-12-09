const express = require("express");
const { check, body } = require("express-validator");

const adminController = require("../controllers/admin");

const isAuth = require("../middleware/is_auth");

const router = express.Router();

// // /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// // /admin/add-product => POST
router.post(
  "/add-product",
  [
    check("title", "Title have to be at least 5 characters long")
      .isString()
      .isLength({ min: 5 })
      .trim(),
    check("price", "The price has to be a currency value").isFloat().trim(),
    check("description", "Description has to be at least 8 characters long")
      .isLength({ min: 8, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

// // /admin/edit-product => GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// // /admin/edit-product => POST
router.post(
  "/update-product",
  isAuth,
  check("title", "Title have to be at least 5 characters long")
    .isLength({ min: 5 })
    .trim()
    .escape(),
  check("price", "The price has to be a currency value").isCurrency().trim(),
  check("description", "Description has to be at least 8 characters long")
    .isLength({ min: 8, max: 400 })
    .trim()
    .escape(),
  adminController.postEditProduct
);

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// // /admin/delete-product => POST
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

exports.routes = router;
