const getDb = require("../util/database").getDb;
const ObjectId = require("mongodb").ObjectID;

module.exports = class Products {
  constructor(title, imageUrl, price, description, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = new ObjectId(id);
  }

  save() {
    const db = getDb();
    if (this._id) {
      const filter = { _id: this._id };
      const updateDoc = { $set: this };

      db.collection("products")
        .updateOne(filter, updateDoc)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.log(err));
    } else {
      db.collection("products")
        .insertOne(this)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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

  static fetchById(id) {
    const db = getDb();

    return db
      .collection("products")
      .find({ _id: new ObjectId(id) })
      .next()
      .then((results) => {
        return results;
      })
      .catch((err) => {
        throw err;
      });
  }
};

// in find method we can add filters
// to retrieve specifics parts of a collection
