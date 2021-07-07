const getDb = require("../util/database").getDb;
const ObjectId = require("mongodb").ObjectID;

module.exports = class Products {
  constructor(title, imageUrl, price, description, id, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new ObjectId(id) : null;
    this.userId = userId;
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
          console.log("added");
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

  static deleteById(id) {
    const db = getDb();

    db.collection("products").deleteOne({ _id: new ObjectId(id) });
  }
};

// in find method we can add filters
// to retrieve specifics parts of a collection
// like a sql query
