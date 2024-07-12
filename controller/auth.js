const User = require("../model/users");
const Admin = require("../model/admin");

exports.getLogin = (req, res) => {
  res.render("login", { title: "Login", path: "/login" });
};

//manually setting the profile pic data inside session storage, after saving the session redirecting to home page.
exports.postLogin = (req, res) => {
  User.findById("668e7a322ceb1116c78ffe2c").then((user) => {
    req.session.isLoggedIn = true;
    req.session.profilePic = user.imageURL;
    req.session.save((err) => {
      if (err) console.log(err);
      res.redirect("/");
    });
  });
};

exports.getSignup = (req, res) => {
  res.render("signup", {
    title: "Signup",
  });
};

exports.postSignup = (req, res) => {
  const { email, password, cPassword } = req.body;
  Admin.findOne({ email: email }).then((admin) => {
    if (admin) {
      return res.send("User  exists already");
    }
    const newAdmin = new Admin({
      email,
      password,
    });
    newAdmin
      .save()
      .then((result) => res.redirect("/auth/login"))
      .catch((err) => console.log(err));
  });
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/auth/login");
  });
};
