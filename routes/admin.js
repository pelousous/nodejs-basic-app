const express = require("express");

const adminController = require("../controllers/admin");

const isAuth = require("../middleware/is_auth");

const router = express.Router();

// // /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// // /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

// // /admin/edit-product => GET
router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

// // /admin/edit-product => POST
router.post("/update-product", isAuth, adminController.postEditProduct);

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// // /admin/delete-product => POST
router.post("/delete-product", isAuth, adminController.postDeleteProduct);

exports.routes = router;
