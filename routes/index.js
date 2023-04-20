const path = require('path')
class IndexRoute {
  constructor() {
    this.router = require("express").Router();
    this.middleware = require("../middleware");
    this.authController = require("../controllers/AuthController");
    this.scanDocumentController = require("../controllers/ScannerController");
    this.multer = require('multer');
    this.fs = require('fs')
    this.storage = this.multer.diskStorage({
        destination:  (req, file, cb) => {
            if(!this.fs.existsSync(`public/documentToScan`)){
                this.fs.mkdirSync(`public/documentToScan`);
            }
            cb(null, `./public/documentToScan/`);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    });
    this.upload = this.multer({ 
        storage: this.storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            console.log(file, ext);
            if(ext !== '.png') {
                return callback('Only png file is allowed')
            }
            callback(null, file)
        },
    });
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

    this.router.get(
      "/get-form",
      this.scanDocumentController.getForm.bind(this.scanDocumentController)
    )

    this.router.post(
      "/upload-document",
      this.upload.any("user_picture"),
      this.scanDocumentController.scanDocument.bind(this.scanDocumentController)
    )

    this.router.post(
      "/submit-form",
      this.scanDocumentController.submitForm.bind(this.scanDocumentController)
    )
  }

}

const router = new IndexRoute();
module.exports = router.router;
