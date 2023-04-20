const BaseController = require('./BaseController')
const vision = require('@google-cloud/vision');
class ScannerController extends BaseController {
  constructor() {
    super()
    this.es6BindAll = require("es6bindall");
    this.tesseract = require('tesseract.js');
    this.fs = require('fs');
    this.es6BindAll(this, ["scanDocument"]);
    // Starting November 30, 2022, API keys will be sunset as an authentication method. Learn more about this change: https://developers.hubspot.com/changelog/upcoming-api-key-sunset and how to migrate an API key integration: https://developers.hubspot.com/docs/api/migrate-an-api-key-integration-to-a-private-app to use a private app instead.
    this.hubspot = require('@hubspot/api-client');
    this.hubspotClient = new this.hubspot.Client({"accessToken":process.env.HUBSPOT_AUTH_TOKEN});
  }

  /**
   *
   * Scan Document
   *
   * @return {object}    
   * @param req
   * @param res
   */
  async scanDocument(req, res) {
    const client = new vision.ImageAnnotatorClient({
      keyFilename: "business-scan-card-73d8a2a99a66.json",
    });
    let result=''
    try {
      let arr=[];
      let values={};
      if (req.files.length > 0) {
        [result] = await client.textDetection('./public/documentToScan/document.png');
        console.log(result);
        const [annotation] = result.textAnnotations;
        const text = annotation ? annotation.description.trim() : '';
        arr=text.split(/\r?\n/);
        // let compareResultForName = [];

        values['address']='';
        values['firstName']='';
        for (let i=0; i<arr.length; i++){
          if(values['firstName']=='' && arr[i].match(/\s/g)!=null){
          if(arr[i].match(/\s/g).length === 1){
            let fullname=arr[i].split(' ');
            values['firstName']=fullname[0];
            values['lastName']=fullname[1];
          }

          }
          const emailRegx = /^[a-zA-Z0-9.!#$%&:'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
          let position = arr[i].search(":")+1;
           arr[i]=arr[i].slice(position);
          if(emailRegx.test(arr[i].trim())){
            values['email']=arr[i].replace(/^\s+|\s+$/gm,'');
            // const emailName = arr[i].substring(0, arr[i].indexOf("@"));
            //
            // for (let j = 0; j < arr.length; j++) {
            //   if(arr[j] == arr[i]) {
            //     compareResultForName.push(Number.NEGATIVE_INFINITY)
            //   } else {
            //     compareResultForName.push(this.compare(emailName, arr[j]))
            //   }
            // }
            //
            // const name = arr[compareResultForName.indexOf(Math.max(...compareResultForName))]
            // values["firstName"] = name.split(" ")[0]
            // values["lastName"] = name.split(" ")[1]
          }

          // const mobileNumberRegx = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/gi
          const mobileNumberRegx1 = new RegExp("\\+?\\(?\\d*\\)? ?\\(?\\d+\\)?\\d*([\\s./-]?\\d{2,})+","g");
          const mobileNumberRegx2 = /(?:[-+() ]*\d){10,13}/gm;
          if(mobileNumberRegx1.test(arr[i]) && mobileNumberRegx2.test(arr[i])){
            values['phone']=arr[i];
          }
          console.log(arr[i]);

          if(arr[i].search("www")>-1){

            values['website']=arr[i];
          }

          if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%£&'()*+,-.\/:;<=>?@[\\\]^_`{|}~])[A-Za-z\d !"#$£%&'()*+,-.\/:;<=>?[\\\]^_`{|}~]{1,300}$/.test(arr[i].trim())){
            values['address']+= arr[i];
          }

          // const addressRegx = /^[a-zA-Z0-9\s,.'-]{3,}$/g;
          // if(addressRegx.test(arr[i])){
          //   values['street_address']=arr[i];
          // }
          
          // const nameRegx = /^(([A-Za-z]+[\-\']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-\']?)*([A-Za-z]+)?$/;
          // if(nameRegx.test(arr[i])){
          //   values['name']=arr[i];
          // }

        }
        return res.send({
          status: true,
          values: values
        })

      }

    } catch (e) {
      console.log("error =>>>>>>>>>>>>>>", e)
      return res.send({
        status: false
      })
    }
  }

  compare(strA,strB){
    for(var result = 0, i = strA.length; i--;){
        if(typeof strB[i] == 'undefined' || strA[i] == strB[i]);
        else if(strA[i].toLowerCase() == strB[i].toLowerCase())
            result++;
        else
            result += 4;
    }
    return 1 - (result + 4*Math.abs(strA.length - strB.length))/(2*(strA.length+strB.length));
  }

  async submitForm (req, res){
    try {
      const properties = {
        firstname: req.body.firstName+'test',
        lastname: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        // website: req.body.website,
        company: req.body.company_name,
        // street_address: req.body.street_address,
        // city: req.body.city,
        // state: req.body.state,
        // postal_code: req.body.postal_code
      };

      const simplePublicObjectInputForCreate = { properties, associations: [] };
      const apiResponse = await this.hubspotClient.crm.contacts.basicApi.create(simplePublicObjectInputForCreate);
      return res.send({
        status: true,
        data: apiResponse
      })
    } catch (e) {
      e.message === 'HTTP request failed' ? console.error(JSON.stringify(e.response, null, 2)) : console.error(e)
      console.log("error =>>>>>>>>>>>>>>", e.message)
      return res.send({
        status: false,
        message: e.message
      })
    }
  }

}

module.exports = new ScannerController();