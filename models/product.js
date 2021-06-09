const fs = require("fs");
const path = require("path");
const p = path.join(path.dirname(require.main.filename), "data", "product.js");

const getProductsFromFile = (cb) => {
  let products = [];

  fs.readFile(p, (err, data) => {
    if (!err) products = JSON.parse(data);

    cb(products);
  });
};

module.exports = class Product {
  save(title, imageUrl, price, description) {
    this.id = Math.random().toString();
    getProductsFromFile((products) => {
      products.push({
        id: this.id,
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
      });
      fs.writeFile(p, JSON.stringify(products), (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        console.log("data saved !!");
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static fetchById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
