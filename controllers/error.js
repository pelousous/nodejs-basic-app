const get404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "404",
    isAuthenticated: req.session.isLoggedIn,
  });
};

const get500 = (req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Server error occurred",
    path: "500",
    isAuthenticated: req.session.isLoggedIn,
  });
};

module.exports = {
  get404,
  get500,
};
