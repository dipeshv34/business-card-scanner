const BaseController = require('./BaseController')

class ScannerController extends BaseController {
  constructor() {
    super()
    this.es6BindAll = require("es6bindall");
    this.tesseract = require('tesseract.js');
    this.fs = require('fs');
    this.es6BindAll(this, ["scanDocument"]);
  }

  /**
 *
 * Scan Document
 *
 * @param  {object}   request
 * @param  {object}   response
 * @return {object}	  login
 */
  async scanDocument(req, res) {
    try {
      console.log(req.files)
      if (req.files.length > 0) {

        this.tesseract.recognize(
          // this first argument is for the location of an image it can be a //url like below or you can set a local path in your computer
          'public\\documentToScan\\test.jpg',
          // this second argument is for the laguage
          'eng',
          { logger: m => console.log("logger", m) }
        ).then(({ data: { text } }) => {
          console.log("text ->>>>>>>>>>", text);
        })
      }

      // if(this.fs.existsSync(req.files[0].path)){
      //   this.fs.unlinkSync(req.files[0].path)
      // }

      return res.send()
    } catch (e) {
      console.log("error =>>>>>>>>>>>>>>", e.message)
    }

  }

}

module.exports = new ScannerController();