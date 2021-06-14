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
  save(id, title, imageUrl, price, description) {
    if (id) {
      getProductsFromFile((products) => {
        const editProductIndex = products.findIndex((p) => p.id === id);
        products[editProductIndex] = {
          id,
          title,
          imageUrl,
          description,
          price,
        };
        fs.writeFile(p, JSON.stringify(products), (err, data) => {
          if (err) {
            console.log(err);
            return;
          }
        });
      });
    } else {
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
        });
      });
    }
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static fetchById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
  static deleteById(id) {
    getProductsFromFile((products) => {
      const productIndex = products.findIndex((p) => p.id === id);
      products.splice(productIndex, 1);
      fs.writeFile(p, JSON.stringify(products), (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    });
  }
};
