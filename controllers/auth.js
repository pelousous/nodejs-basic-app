const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getLogin = (req, res, next) => {
  //const isAuthenticated = req.get("Cookie").split("=")[1];
  //console.log(isAuthenticated);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

const postLogin = (req, res, next) => {
  //res.setHeader("Set-Cookie", "loggedIn=true");
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.redirect("/login");
    }

    bcrypt.compare(password, user.password).then((isTheSame) => {
      console.log(isTheSame);
      if (!isTheSame) return res.redirect("/login");

      req.session.isLoggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    });
  });

  // User.findById("60e80aa4677c9209b43a054d")
  //   .then((user) => {
  //     req.session.isLoggedIn = true;
  //     req.session.user = user;
  //     res.redirect("/");
  //   })
  //   .catch((err) => {
  //     throw err;
  //   });
};

const postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // console.log(email + " " + password + " " + confirmPassword);
  User.findOne({ email: email }, (error, user) => {
    if (user) {
      return res.redirect("/login");
    }

    bcrypt
      .hash(password, 12)
      .then((hashed) => {
        const user = new User({
          email: email,
          password: hashed,
          cart: {
            items: [],
          },
        });

        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      });
  });
};

const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = {
  getLogin,
  getSignup,
  postLogin,
  postSignup,
  postLogout,
};
