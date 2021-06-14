const Product = require("../models/product");

const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    edit: false,
    product: {},
  });
};

const postAddProduct = (req, res, next) => {
  const product = new Product();
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  product.save(null, title, imageUrl, price, description);
  res.redirect("/");
};

const getEditProduct = (req, res, next) => {
  const isEditing = req.query.edit;
  const productId = req.params.productId;

  Product.fetchById(productId, (product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "admin/edit-product",
      edit: isEditing,
      product: product,
    });
  });
};

const postEditProduct = (req, res, next) => {
  const product = new Product();
  const id = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const price = req.body.price;
  product.save(id, title, imageUrl, price, description);
  res.redirect("/admin/products");
};

const getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

const postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId);
  res.redirect("/admin/products");
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};
