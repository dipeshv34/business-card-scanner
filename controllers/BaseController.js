/**
 * This class will be extended by all other controllers
 */
class BaseController {
    constructor() {
        this.mongoose = require('mongoose')
        this.Joi = require('joi')
        this.bcrypt = require('bcrypt')
        this.logger = require("../helpers/Logger")
        this.axios = require("axios")
        this.helperResponse = require('../helpers/HelperResponse')
    }
}

module.exports = BaseController;