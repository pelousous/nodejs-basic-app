const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
// const sgTransport = require("nodemailer-sendgrid-transport");

// const options = {
//   auth: {
//     api_user: "SENDGRID_USERNAME",
//     api_key: "SENDGRID_PASSWORD",
//   },
// };

// const client = nodemailer.createTransport(sgTransport(options));

// https://stackoverflow.com/questions/60641391/nodemailer-does-not-work-with-aruba-webmail
var client = nodemailer.createTransport({
  host: process.env.EMAIL_ACCOUNT_HOST,
  logger: true,
  debug: true,
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_ACCOUNT_USER,
    pass: process.env.EMAIL_ACCOUNT_PASSWORD,
  },
  tls: {
    minVersion: "TLSv1",
    ciphers: "HIGH:MEDIUM:!aNULL:!eNULL:@STRENGTH:!DH:!kEDH",
  },
});

const getLogin = (req, res, next) => {
  //const isAuthenticated = req.get("Cookie").split("=")[1];
  //console.log(isAuthenticated);
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    messages: req.flash("error"),
  });
};

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    messages: req.flash("error"),
  });
};
const getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset password",
    messages: req.flash("error"),
  });
};

const postLogin = (req, res, next) => {
  //res.setHeader("Set-Cookie", "loggedIn=true");
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("error", "the email or password is not valid");
      return res.redirect("/login");
    }

    bcrypt.compare(password, user.password).then((isTheSame) => {
      if (!isTheSame) {
        req.flash("error", "the email or password is not valid");
        return res.redirect("/login");
      }

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
      req.flash("error", "Email already exists, pick another one");
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

        const email = {
          from: "test@nodemailer.com",
          to: "info@davideravasi.com",
          subject: "Hello",
          text: "Hello world",
          html: "<b>Hello world</b>",
        };

        client.sendMail(email, function (err, info) {
          if (err) {
            console.log(error);
          } else {
            console.log("Message sent: " + info.response);
          }
        });
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
  getReset,
  postLogin,
  postSignup,
  postLogout,
};
