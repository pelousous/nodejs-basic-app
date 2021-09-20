const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const newCart = [...this.cart.items];
  const foundIndex = newCart.findIndex(
    (el) => el.productId.toString() === product._id.toString()
  );

  if (foundIndex >= 0) {
    newCart[foundIndex].quantity += 1;
  } else {
    newCart.push({ productId: product._id, quantity: 1 });
  }

  this.cart.items = newCart;

  return this.save();
};

userSchema.methods.removeItemFromCart = function (productId) {
  const newCartItems = this.cart.items.filter((el) => {
    return el.productId.toString() !== productId.toString();
  });

  this.cart.items = newCartItems;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
