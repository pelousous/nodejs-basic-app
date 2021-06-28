const path = require("path");
const express = require("express");
const app = express();
const errorController = require("./controllers/error");
const User = require("./models/user");
// const db = require("./util/database_mysql");
const mongoConnect = require("./util/database").mongoConnect;

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
  User.findById("60d99423e2b3192a4fdc54c5")
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

// app.listen(3000);

mongoConnect(() => {
  app.listen(3000);
});
