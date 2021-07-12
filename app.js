const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const errorController = require("./controllers/error");
const User = require("./models/user");
//const User = require("./models/user");
// const db = require("./util/database_mysql");
//const mongoConnect = require("./util/database").mongoConnect;

// db.execute("SELECT * FROM plants")
//   .then((results) => {
//     console.log(results);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

app.set("view engine", "ejs");
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("60e80aa4677c9209b43a054d")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      throw err;
    });
});

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://davidepelo:pelosone75@cluster0.ijrdt.mongodb.net/node-tuts?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    // create a user if not in db
    User.findById("60e80aa4677c9209b43a054d").then((user) => {
      if (!user) {
        const user = new User({
          name: "Davide",
          email: "info@davideravasi.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
    console.log("connected with mongoose");
  })
  .catch((err) => {
    console.log(err);
  });

// app.listen(3000);

// mongoConnect(() => {
//   app.listen(3000);
// });
