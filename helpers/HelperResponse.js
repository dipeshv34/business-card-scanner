class HelperResponse{
    constructor() {
        this.config = require("../config/Config")
        this.logger = require("./Logger.js")
    }

    /**
     *
     * get session
     *
     * @param  {string}  key
     * @return {object}
     */
     getSession(req, key) {
        return req.session[key]
    }

    /**
     *
     * set session
     *
     * @param  {string}  key
     * @param  {object}  value
     * @return {object}
     */
     setSession(req, key, value) {
         req.session[key] = value
    }

    /**
     *
     * detroy session
     * @param  {object}  request
     * @return {object}
     */
     destroySession(req) {
        req.session.destroy()
    }
}

module.exports = new HelperResponse()