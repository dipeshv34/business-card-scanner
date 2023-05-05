const BaseController = require('./BaseController')
const vision = require('@google-cloud/vision');
class ScannerController extends BaseController {
  constructor() {
    super()
    this.es6BindAll = require("es6bindall");
    this.tesseract = require('tesseract.js');
    this.http = require("https");
    this.fs = require('fs');
    this.es6BindAll(this, ["scanDocument", "getForm"]);
    // Starting November 30, 2022, API keys will be sunset as an authentication method. Learn more about this change: https://developers.hubspot.com/changelog/upcoming-api-key-sunset and how to migrate an API key integration: https://developers.hubspot.com/docs/api/migrate-an-api-key-integration-to-a-private-app to use a private app instead.
    this.hubspot = require('@hubspot/api-client');
    this.hubspotClient = new this.hubspot.Client({"accessToken":process.env.HUBSPOT_AUTH_TOKEN});
    this.countries = ['Afghanistan', 'Aland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia (Plurinational State of)', 'Bonaire, Sint Eustatius and Saba', 'Bosnia and Herzegovina', 'Botswana', 'Bouvet Island', 'Brazil', 'British Indian Ocean Territory', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo', 'Congo (Democratic Republic of the)', 'Cook Islands', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Cuba', 'Curacao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands (Malvinas)', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard Island and McDonald Islands', 'Holy See', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran (Islamic Republic of)', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', "Korea (Democratic People's Republic of)", 'Korea (Republic of)', 'Kuwait', 'Kyrgyzstan', "Lao People's Democratic Republic", 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macao', 'Macedonia (the former Yugoslav Republic of)', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia (Federated States of)', 'Moldova (Republic of)', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine, State of', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russian Federation', 'Rwanda', 'Saint Barthelemy', 'Saint Helena, Ascension and Tristan da Cunha', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin (French part)', 'Saint Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten (Dutch part)', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia and the South Sandwich Islands', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Taiwan, Province of China[a]', 'Tajikistan', 'Tanzania, United Republic of', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom of Great Britain and Northern Ireland', 'United States of America', 'United States Minor Outlying Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela (Bolivarian Republic of)', 'Viet Nam', 'Virgin Islands (British)', 'Virgin Islands (U.S.)', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe']
  }

  /**
   * Get form fields
   *
   * @return {object}
   * @param req
   * @param res
   */
  async getForm(_, res) {
    try {
      var options = {
        "method": "GET",
        "hostname": "api.hubapi.com",
        "port": null,
        "path": `/marketing/v3/forms/${process.env.HUBSPOT_FORM_ID}`,
        "headers": {
          "accept": "application/json",
          "authorization": `Bearer ${process.env.HUBSPOT_AUTH_TOKEN}`
        }
      };

      var req = this.http.request(options, function (data) {
        var chunks = [];

        data.on("data", function (chunk) {
          chunks.push(chunk);
        });

        data.on("end", function () {
          var body = Buffer.concat(chunks);
          return res.send({
            status: true,
            data: body.toString()
          })
          // return body
        });
      });


      // var req = this.http.request(options, function (data) {
      //   var chunks = [];
      //   console.log(data);
      //   data.on("data", function (chunk) {
      //     chunks.push(chunk);
      //   });
      //
      //   data.on("end", function () {
      //     var body = Buffer.concat(chunks);
      //     return res.send({
      //       status: true,
      //       data: body.toString()
      //     })
      //    // return body
      //   });
      // });

      req.end();
    } catch (e) {
      console.log("error =>>>>>>>>>>>>>>", e)
      return res.send({
        status: false
      })
    }
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
      keyFilename: "business-scan-card-key.json",
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
        let compareResultForName = [];

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
            const emailCompanyName = arr[i].substring(arr[i].indexOf("@"), arr[i].indexOf("."));

            for (let j = 0; j < arr.length; j++) {
              if(arr[j] == arr[i]) {
                compareResultForName.push(Number.NEGATIVE_INFINITY)
              } else {
                compareResultForName.push(this.compare(emailCompanyName, arr[j]))
              }
            }

            values["company_name"] = arr[compareResultForName.indexOf(Math.max(...compareResultForName))]
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

        if(values['address'] && values['address'] != '') {
          let listOfWords = values['address'].split(', ');
          listOfWords.forEach(word => {
            if(this.countries.includes(word.trim())) {
              values['country']+= word;
            }
          });
        }
        console.log(values)
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
      // const properties = {
      //   firstname: req.body.firstname,
      //   lastname: req.body.lastname,
      //   email: req.body.email,
      //   phone: req.body.phone,
      //   website: req.body.website,
      //   notes: req.body.notes,
      //   hs_lead_status: req.body.lead_status___event,
      //   inquiry_type: req.body.inquiry_type,
      //   partner_category: req.body.partner_category,
      //   partner_status: req.body.partner_status,
      //   sales_owner: req.body.sales_owner,
      //   company_name: req.body.company,
      //   country: req.body.country
      // };

      const properties = req.body;
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