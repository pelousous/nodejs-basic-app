const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getReset);

router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("This email is not valid")
    .normalizeEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (!user) {
          return Promise.reject("the email doesn't exists in our db");
        }
      });
    }),
  check("password", "The password must be at least 5 characters long")
    .isLength({ min: 5 })
    .trim()
    .escape(),
  authController.postLogin
);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("This email is not valid")
    .normalizeEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already exists, pick another one");
        }
      });
    }),
  body("password", "The password must be at least 8 characters long")
    .isLength({
      min: 8,
    })
    .trim()
    .escape(),
  body("confirmPassword")
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw Error("Password don't match");
      } else {
        return value;
      }
    }),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
