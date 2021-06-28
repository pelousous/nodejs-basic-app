const getDb = require("../util/database").getDb;
const ObjectId = require("mongodb").ObjectID;

module.exports = class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  save() {
    const db = getDb();

    db.collection("users")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: new ObjectId(id) })
      .next()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        throw err;
      });
  }
};
