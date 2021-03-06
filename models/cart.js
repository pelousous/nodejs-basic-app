const fs = require("fs");
const path = require("path");
const p = path.join(path.dirname(require.main.filename), "data", "cart.js");

module.exports = class Cart {
  static addProduct(id, price) {
    fs.readFile(p, (err, data) => {
      let cart = {
        products: [],
        totalPrice: 0,
      };

      if (!err) {
        cart = JSON.parse(data);
      }

      const prodExists = cart.products.find((prod) => prod.id === id);
      const prodExistsIndex = cart.products.findIndex((prod) => prod.id === id);
      let updatedProduct;
      if (prodExists) {
        updatedProduct = prodExists;
        updatedProduct.qty += 1;
        cart.products[prodExistsIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice += parseInt(price);

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(productId, price) {
    fs.readFile(p, (err, data) => {
      if (err) return;

      const updatedCart = JSON.parse(data);
      const prodToErase = updatedCart.products.find(
        (el) => el.id === productId
      );
      updatedCart.totalPrice = updatedCart.totalPrice - price * prodToErase.qty;
      updatedCart.products = updatedCart.products.filter(
        (el) => el.id !== productId
      );

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, data) => {
      if (err) return;

      cb(JSON.parse(data));
    });
  }
};
