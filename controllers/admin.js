const Product = require("../models/product");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");

const { deleteFile } = require("../util/file");

const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    messages: null,
    edit: false,
    product: {},
    errorsValues: [],
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postAddProduct = (req, res, next) => {
  // const product = new Product(
  //   (title = req.body.title),
  //   (imageUrl = req.body.imageUrl),
  //   (price = req.body.price),
  //   (description = req.body.description.trim()),
  //   null,
  //   req.user._id
  // );
  const title = req.body.title;
  const imageUrl = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      edit: false,
      messages: errors.array()[0].msg,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorsValues: errors.array(),
      validationErrors: errors.array(),
    });
  }
  if (!imageUrl) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      edit: false,
      messages: "the attached file is not valid or empty",
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorsValues: [],
      validationErrors: [],
    });
  }
  const product = new Product({
    // _id: mongoose.Types.ObjectId("60e8126d16336433409e7e48"),
    title: req.body.title,
    imageUrl: imageUrl.path,
    price: req.body.price,
    description: req.body.description.trim(),
    userId: req.session.user,
  });

  product
    .save()
    .then((results) => {
      res.redirect("/");
    })
    .catch((err) => {
      const error = new Error("Error with the database");
      error.httpStatusCode = 500;
      next(error);
    });
};

const getEditProduct = (req, res, next) => {
  const isEditing = req.query.edit;
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit product",
        path: "admin/edit-product",
        messages: "",
        edit: isEditing,
        product: product,
        errorsValues: [],
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error("Error with the database");
      error.httpStatusCode = 500;
      return next(error);
    });
};

const postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const id = req.body.productId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "admin/edit-product",
      messages: errors.array()[0].msg,
      edit: true,
      product: {
        _id: id,
        title: title,
        price: price,
        description: description,
        userId: req.user._id.toString(),
      },
      errorsValues: errors.array(),
      isAuthenticated: req.session.isLoggedIn,
    });
  }

  //const product = new Product(title, imageUrl, price, description, id);
  Product.findById(id)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      if (imageUrl) {
        deleteFile(product.imageUrl);
        product.imageUrl = imageUrl.path;
      }
      product.price = price;
      product.description = description;
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      const error = new Error("Error with the database");
      error.httpStatusCode = 500;
      next(error);
    });
};

const getProducts = (req, res, next) => {
  const products = Product.find({ userId: req.user._id.toString() })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "All Products",
        path: "/admin/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error("Error with the database");
      error.httpStatusCode = 500;
      next(error);
    });
};

const postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("product not found! "));
      }
      deleteFile(product.imageUrl);

      return Product.remove({ _id: productId, userId: req.user._id });
    })
    .then((response) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
};

/*
    const db = getDb();
    const ids = this.cart.items.map((el) => el.productId);
    return db
      .collection("products")
      .find({ _id: { $in: ids } })
      .toArray()
      .then((products) => {
        console.log(products);
        return products.map((prod) => {
          return {
            ...prod,
            quantity: this.cart.items.find(
              (el) => el.productId.toString() == prod._id.toString()
            ).quantity,
          };
        });
      });

*/
