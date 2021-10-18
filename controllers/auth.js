const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const user = require("../models/user");
const { validationResult } = require("express-validator");
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
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

const getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    messages: req.flash("error"),
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      messages: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          messages: "The email doesn't exists in our db",
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((isTheSame) => {
          if (!isTheSame) {
            return res.status(422).render("auth/login", {
              path: "/login",
              pageTitle: "Login",
              messages: "There an error in your connection datas",
              oldInput: {
                email: email,
                password: password,
              },
              validationErrors: [],
            });
          }

          req.session.isLoggedIn = true;
          req.session.user = user;
          return res.redirect("/");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));

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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      messages: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  // console.log(email + " " + password + " " + confirmPassword);
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
};

const postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

const postReset = (req, res, next) => {
  const email = req.body.email;

  //if exists create token
  crypto.randomBytes(32, (err, buf) => {
    if (err) throw err;

    const token = buf.toString("hex");

    // check if email exists
    User.findOne({ email: email })
      .then((user) => {
        // if doesn't exists redirect and flash message
        if (!user) {
          req.flash("error", "this email doesn't exists in our database");
          return res.redirect("/login");
        }

        // save token to mongodb
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        // send email with link
        const email = {
          from: "test@nodemailer.com",
          to: "info@davideravasi.com",
          subject: "Reset password",
          text: "Reset password",
          html: `<h1>You requested to password reset</h1>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset your password</p>`,
        };

        client.sendMail(email, function (err, info) {
          if (err) {
            console.log(error);
          } else {
            req.flash(
              "error",
              "Message sent with the link to reset your password"
            );
          }
        });
      });
  });
};

const getNewPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  }).then((user) => {
    if (!user) {
      req.flash("error", "this token doesn't exists on our db");
      return res.redirect("/login");
    }

    res.render("auth/new-password", {
      pageTitle: "Reset password",
      path: "/reset-password",
      messages: req.flash("error"),
      userId: user._id,
      token: token,
    });
  });
};

const postNewPassword = (req, res, next) => {
  const password = req.body.password;
  const userId = req.body.userId;
  const token = req.body.token;
  let resetUser;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashed) => {
      resetUser.password = hashed;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      resetUser.save();

      return resetUser;
    })
    .then((user) => {
      res.redirect("/login");
      const email = {
        from: "test@nodemailer.com",
        to: "info@davideravasi.com",
        subject: "Reset password",
        text: "Reset password",
        html: `<h1>thanks ${user.email}</h1>
              <p>Your password has been resetted</p>`,
      };

      client.sendMail(email, function (err, info) {
        if (err) {
          console.log(error);
        } else {
          req.flash("error", "Password succesfully resetted");
        }
      });
    });
};

module.exports = {
  getLogin,
  getSignup,
  getReset,
  getNewPassword,
  postLogin,
  postSignup,
  postLogout,
  postReset,
  postNewPassword,
};
