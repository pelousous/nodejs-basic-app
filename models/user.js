const getDb = require("../util/database").getDb;
const ObjectId = require("mongodb").ObjectID;

module.exports = class User {
  constructor(id, name, email, cart) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.cart = cart;
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

  addToCart(product) {
    const db = getDb();
    const newCart = [...this.cart.items];
    console.log("new cart: " + newCart);
    const foundIndex = newCart.findIndex(
      (el) => el.productId.toString() === product._id.toString()
    );

    console.log("foundindex: ", foundIndex);

    if (foundIndex >= 0) {
      newCart[foundIndex].quantity += 1;
    } else {
      newCart.push({ productId: new ObjectId(product._id), quantity: 1 });
    }

    const newValues = {
      $set: {
        cart: {
          items: newCart,
        },
      },
    };

    return db
      .collection("users")
      .updateOne({ _id: new ObjectId(this.id) }, newValues);
  }

  getCart() {
    const db = getDb();
    const ids = this.cart.items.map((el) => {
      return el.productId;
    });

    return db
      .collection("products")
      .find({ _id: { $in: ids } })
      .toArray()
      .then((products) => {
        return products.map((prod) => {
          return {
            ...prod,
            quantity: this.cart.items.find(
              (el) => el.productId.toString() === prod._id.toString()
            ).quantity,
          };
        });
      });
  }
};
