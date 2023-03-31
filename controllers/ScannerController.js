const BaseController = require('./BaseController')
const vision = require('@google-cloud/vision');
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
   * @return {object}      login
   * @param req
   * @param res
   */
  async scanDocument(req, res) {
    const client = new vision.ImageAnnotatorClient({
      keyFilename: "business-scanner-382220-7f07efe496d7.json",
    });
    let result=''
    try {
      let arr=[];
      if (req.files.length > 0) {
         [result] = await client.textDetection(req.files[0].path);
        const [annotation] = result.textAnnotations;
        const text = annotation ? annotation.description.trim() : '';
        arr=text.split(/\r?\n/);
        let values=[];
        for (let i=0; i<arr.length; i++){
          const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
          if(regexExp.test(arr[i])){
            values['email']=arr[i];
            const emailName = arr[i].substring(0, arr[i].indexOf("@"));

          }

        }

      }

      return res.send({
        status: true,
        result
      })
    } catch (e) {
      console.log("error =>>>>>>>>>>>>>>", e.message)
    }

  }

}

module.exports = new ScannerController();