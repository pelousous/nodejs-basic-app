const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const errorController = require("./controllers/error");
const User = require("./models/user");
const csrf = require("csurf");
const flash = require("connect-flash");
const dotenv = require("dotenv");

dotenv.config();
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

const MONGODB_URI = process.env.MONGO_URL;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "pelousous session",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrf());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      throw err;
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(flash());

app.use("/admin", adminData.routes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    // create a user if not in db
    // User.findById("60e80aa4677c9209b43a054d").then((user) => {
    //   if (!user) {
    //     const user = new User({
    //       name: "Davide",
    //       email: "info@davideravasi.com",
    //       cart: {
    //         items: [],
    //       },
    //     });
    //     user.save();
    //   }
    // });

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
