const BaseController = require('./BaseController')
const { ErrorHandler } = require('../helpers/error')
const config = require('../config/Config')

class AuthController extends BaseController{
    constructor() {
        super()
        this.validation = require("../validations/userValidations")
        this.es6BindAll = require("es6bindall");
        this.logger = require("../helpers/Logger")
        this.es6BindAll(this, ["login", "login_user", "logout"]);
    }

    /**
   *
   * login
   *
   * @param  {object}   request
   * @param  {object}   response
   * @return {object}	  login
   */
    async login(req, res){
      try {
          const data = await this.axios.get('https://api.hubapi.com/crm/v3/objects/contacts',
            {
              headers: {
                'Authorization': `Bearer ${process.env.HUBSPOT_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
              }
            });

          return res.render('pages/scanner');
            
      } catch (e) {
        console.log("error =>>>>>>>>>>>>>>", e.message)
      }

    }


    /**
   *
   * login_user
   *
   * @param  {object}   request
   * @param  {object}   response
   * @return {object}	  login_user
   */
  async login_user(req, res) {
    if(process.env.STAGE != "production"){
      this.logger.logCall(req.path, req.method, req.body)
    }
    var validationRes = this.validation.loginValidation.validate(req.body);
    if (validationRes.error) {
      res.status(400).send({
        message: validationRes.error.details[0].message,
        type: "ValidationError",
      });
    } else {
      // var user = await this.userService.getUserByCred(
      //   res,
      //   req.body.email,
      //   req.body.password
      // );
      // if (user.status) {
  
      //     this.helperResponse.setSession(req, "user", JSON.parse(JSON.stringify(user)).data.email);
      //     this.helperResponse.setSession(req, "role", JSON.parse(JSON.stringify(user)).data.role);
      //       res.status(200).json({
      //         status: true
      //       })
      //     } else {
      //       var error = await ErrorHandler(user,"login_user")
      //       res.status(error.code).json({
      //         status:false,
      //         message: error.message
      //       })
      //   }
    }
  }


  /**
   *
   * used for logout
   *
   * @param  {object}   request
   * @param  {object}   response
   * @return {object}	 redirect to home page
   */
   logout(req, res) {
    if(process.env.STAGE != "production"){
      this.logger.logCall(req.path, req.method, req.body)
    }
    this.helperResponse.destroySession(req);
    res.redirect("/");
  }


}

module.exports = new AuthController();