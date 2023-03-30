const Joi = require('joi')

module.exports = {
    loginValidation: Joi.object({
        password: Joi.string().required(),
        email: Joi.string().email().required(),
    })
}