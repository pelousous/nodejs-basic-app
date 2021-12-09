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
const multer = require("multer");

// diskstorage = multer storage engine
const storage = multer.diskStorage({
  // cb = callback function
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file);
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/*
config will read your .env file, 
parse the contents, 
assign it to process.env, 
and return an Object with a parsed key containing the loaded content or an error key if it failed.
*/
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
// we can specify static paths and where to find the file
// for every call to the specific path
// added in the first parameter
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);
app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));

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
      if (!user) {
        next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
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

app.use("/500", errorController.get500);

app.use(errorController.get404);

// special middleware that take an error as first argument
// triggered by throwing an error an pass it to next()
/*
      EX: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      const error = new Error("Error with the database");
      error.httpStatusCode = 500;
      next(error);
*/
app.use((err, req, res, next) => {
  res.redirect("/500");
});

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
