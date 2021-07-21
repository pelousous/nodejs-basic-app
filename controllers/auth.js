const User = require("../models/user");

const getLogin = (req, res, next) => {
  //const isAuthenticated = req.get("Cookie").split("=")[1];
  //console.log(isAuthenticated);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const postLogin = (req, res, next) => {
  //res.setHeader("Set-Cookie", "loggedIn=true");
  User.findById("60e80aa4677c9209b43a054d")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect("/");
    })
    .catch((err) => {
      throw err;
    });
};

module.exports = {
  getLogin,
  postLogin,
};
