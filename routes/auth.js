const express = require("express");
const authController = require("../controller/auth");
const { check, body } = require("express-validator");
const Admin = require("../model/admin");

const authRouter = express.Router();

authRouter.get("/login", authController.getLogin);
authRouter.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Invalid password.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);
authRouter.get("/signup", authController.getSignup);
authRouter.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom((value, { req }) => {
        return Admin.findOne({ email: value }).then((admin) => {
          if (admin) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body("password", "Please enter a alphanumeric password of min-length 5")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("cPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match");
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);
authRouter.post("/logout", authController.postLogout);
authRouter.get("/reset", authController.getReset);
authRouter.post("/reset", authController.postReset);
authRouter.get("/reset/:token", authController.getNewPassword);
authRouter.post("/new-password", authController.postNewPassword);

module.exports = authRouter;
