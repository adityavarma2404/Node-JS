exports.get500 = (req, res, next) => {
  return res.status(500).render("500", {
    title: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
};
