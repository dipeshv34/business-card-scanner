class Logger{
    constructor() {
        this.fs = require('fs')
        this.config = require('../config/Config')
        if(!this.fs.existsSync("logs")){
            this.fs.mkdirSync("logs")
        }
    }
    
    /**
     *
     * log error
     *
     * @param  {string/Object}  text
     * @return append log in file
     */
     logError(title, text) {
        var errLog = "Error :" + title + "\n" + JSON.stringify(text) + "\n" + "\n TimeStamp :"+ new Date() + "\n ============================== \n\n"
        this.fs.appendFile("logs/error.log", errLog, function (err) { })
    }

     /**
     *
     * Api Calls 
     *
     * @param  {string/Object}  text
     * @return append apis in file
     */
      logCall(path, type, request) {
        var apiLog = type +" : " + path + "\n Request Data: " + JSON.stringify(request) + "\n TimeStamp :"+ new Date() +"\n ============================== \n\n"
        this.fs.appendFile("logs/calls.log", apiLog , function (err) { })
    }
}

module.exports = new Logger()