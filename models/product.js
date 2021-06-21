const getDb = require("../util/database").getDb;

module.exports = class Products {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    const db = getDb();

    db.collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();

    return db
      .collection("products")
      .find({})
      .toArray()
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }
};
