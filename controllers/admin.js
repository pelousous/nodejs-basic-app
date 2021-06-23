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
  console.log(req.body);
  const product = new Product(
    (title = req.body.title),
    (imageUrl = req.body.imageUrl),
    (price = req.body.price),
    (description = req.body.description.trim())
  );
  product.save(product);
  res.redirect("/");
};

const getEditProduct = (req, res, next) => {
  const isEditing = req.query.edit;
  const productId = req.params.productId;

  Product.fetchById(productId).then((product) => {
    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "admin/edit-product",
      edit: isEditing,
      product: product,
    });
  });
};

const postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const id = req.body.productId;

  const product = new Product(title, imageUrl, price, description, id);

  product.save();
  res.redirect("/admin/products");
};

const getProducts = (req, res, next) => {
  const products = Product.fetchAll().then((products) => {
    res.render("admin/products", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

const postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  const price = req.body.price;
  Product.deleteById(productId, price);
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
