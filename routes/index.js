class IndexRoute {
  constructor() {
    this.router = require("express").Router();
    this.middleware = require("../middleware");
    this.authController = require("../controllers/AuthController");
    this.setRoutes();
  }

  setRoutes(){
    // POST methods
    this.router.post(
      "/api/login_user",
      this.authController.login_user.bind(this.authController)
    )

    /* GET home page. */
    this.router.get(
      "/",
      // this.middleware.redirectIfAuthenticated,
      this.authController.login.bind(this.authController)
    )
    
    this.router.get(
      "/logout",
      this.authController.logout.bind(this.authController)
    )
  }

}

const router = new IndexRoute();
module.exports = router.router;
