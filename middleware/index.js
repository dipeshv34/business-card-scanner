const helperResponse = require("../helpers/HelperResponse");

//redirect user to dashboard if already logged in
exports.redirectIfAuthenticated = (req, res, next) => {
    if (helperResponse.getSession(req, "user")) {
      return res.redirect("/index");
    } else {
      next();
    }
};

  //check if user is logged in
exports.checkLogin = async function (req, res, next) {
    if (helperResponse.getSession(req, "user")) {
        next()
    } else {
        return res.redirect("/");
    }
};