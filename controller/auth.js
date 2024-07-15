const bcrypt = require("bcryptjs");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const Admin = require("../model/admin");

const apiKey = SibApiV3Sdk.ApiClient.instance.authentications["api-key"];
apiKey.apiKey = "q";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

exports.getLogin = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("login", {
    title: "Login",
    path: "/login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    errorValidations: [],
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("login", {
      title: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      errorValidations: errors.array(),
    });
  }

  Admin.findOne({ email: email })
    .then((admin) => {
      if (!admin) {
        return res.status(422).render("login", {
          title: "Login",
          errorMessage: "Invalid email or password.",
          oldInput: {
            email: email,
            password: password,
          },
          errorValidations: [],
        });
      }
      bcrypt
        .compare(password, admin.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            // req.session.profilePic = user.imageURL;
            return req.session.save((err) => {
              if (err) console.log(err);
              res.redirect("/");
            });
          }
          return res.status(422).render("login", {
            title: "Login",
            errorMessage: "Invalid email or password.",
            oldInput: {
              email: email,
              password: password,
            },
            errorValidations: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/auth/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.getSignup = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  let feedback = req.flash("signup-feedback");
  if (feedback.length > 0) {
    feedback = feedback[0];
  } else {
    feedback = null;
  }
  res.render("signup", {
    title: "Signup",
    errorMessage: message,
    feedback: feedback,
    errorValidations: [],
    oldData: {
      email: "",
      password: "",
      cPassword: "",
    },
  });
};

exports.postSignup = (req, res) => {
  const { email, password, cPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("signup", {
      title: "Signup",
      errorMessage: errors.array()[0].msg,
      errorValidations: errors.array(),
      feedback: "",
      oldData: {
        email: email,
        password: password,
        cPassword: cPassword,
      },
    });
  }
  // commented because below validation can be handled at express-validator middleware
  // Admin.findOne({ email: email });
  // .then((admin) => {
  //   if (admin) {
  //     req.flash("error", "Email already exists.");
  //     return res.redirect("/auth/signup");
  //   }
  return bcrypt
    .hash(password, 10)
    .then((hashPword) => {
      const newAdmin = new Admin({
        email,
        password: hashPword,
      });
      return newAdmin.save();
    })
    .then((result) => {
      req.flash("signup-feedback", "Successfully signed up");
      res.redirect("/auth/signup");
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.to = [{ email: email }];
      sendSmtpEmail.sender = {
        email: "adityavarma2404@gmail.com",
        name: "Notifier",
      };
      sendSmtpEmail.subject = "Signup successful";
      sendSmtpEmail.htmlContent =
        "<h1> You are successfully signed up, please login </h1>";
      return apiInstance.sendTransacEmail(sendSmtpEmail);
    })
    .catch((err) => console.log(err));
  // })
  // .catch((err) => {
  //   console.log(err);
  //   req.flash("guide", "Please fill the form correctly.");
  //   res.redirect("/auth/signup");
  // });
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/auth/login");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  let reset = req.flash("reset");
  if (reset.length > 0) {
    reset = reset[0];
  } else {
    reset = null;
  }
  res.render("reset", {
    path: "/reset",
    title: "Reset Password",
    errorMessage: message,
    feedback: reset,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/auth/reset");
    }
    const token = buffer.toString("hex");
    Admin.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          res.redirect("/auth/reset");
          return;
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save().then((result) => {
          req.flash("reset", "Reset link sent to your email.");
          res.redirect("/auth/reset");
          const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
          sendSmtpEmail.to = [{ email: req.body.email }];
          sendSmtpEmail.sender = {
            email: "adityavarma2404@gmail.com",
            name: "Notifier",
          };
          sendSmtpEmail.subject = "Password reset";
          sendSmtpEmail.htmlContent = `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:5000/auth/reset/${token}">link</a> to set a new password.</p>
          `;
          return apiInstance.sendTransacEmail(sendSmtpEmail);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  Admin.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash("error");

      res.render("new-password", {
        path: "/new-password",
        title: "New Password",
        errorMessage: message,
        //no need to convert into string
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send("Password reset expired");
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  Admin.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/auth/login");
    })
    .catch((err) => {
      res.send("Password reset expired");
    });
};

// the return statement in res.send("User exists already"); does not actually prevent the subsequent .then() blocks from executing. It only returns from the current function in the .then() chain, but the promise chain continues.
// exports.postSignup = (req, res) => {
//   const { email, password, cPassword } = req.body;
//   Admin.findOne({ email: email })
//     .then((admin) => {
//       if (admin) {
//         return res.send("User  exists already");
//       }
//       return bcrypt.hash(password, 10);
//     })
//     .then((hashPword) => {
//       const newAdmin = new Admin({
//         email,
//         password: hashPword,
//       });
//       return newAdmin.save();
//     })
//     .then((result) => res.redirect("/auth/login"))
//     .catch((err) => console.log(err));
// };
