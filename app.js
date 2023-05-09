// const { handleError } = require('./helpers/error')


class App{

  constructor() {
    
    this.path = require("path")
    require("dotenv").config({ path: this.path.join(__dirname, ".env") })
    
    this.createError = require('http-errors');
    this.express = require('express');
    var ejs = require('ejs');
    this.expressLayout = require("express-ejs-layouts")
    this.bodyParser = require("body-parser")
    this.urlencodedParser = this.bodyParser.urlencoded({ extended: false })  
    this.cookieParser = require('cookie-parser');
    this.logger = require('morgan');
    this.expressSession = require("express-session")
    this.indexRouter = require('./routes/index');
    // IMPORT ROUTE
    // this.microsoftRouter = require('./routes/microsoft');
    this.cors = require( 'cors' )
    this.corsOptions = {
      origin: '*',
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
    }
    
    this.helperResponse = require("./helpers/HelperResponse")
    // this.database = require("./database/Database")
    this.config = require("./config/Config")
    this.app = this.express();
    
    
    // view engine setup
    this.app.set("views", this.path.join(__dirname, "views"));
    this.app.set("view engine", "ejs");
    this.app.use(this.logger('dev'));
    this.app.use(this.express.json());
    // this.app.use(this.expressLayout)
    // this.app.set("layout", "layout/layout", true)
    // this.app.set("layout", "layout/guest", true)
    this.app.set("extractScripts", true)
    this.app.use(this.express.urlencoded({ extended: false }));
    this.app.use(this.cookieParser());
    this.app.use(this.express.static(this.path.join(__dirname, "public")))
    
    this.app.use(this.expressSession({
      secret: this.config.commonConfig.SECRET_KEY,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      },
      resave: true,
      saveUninitialized: true
    } ) )
    
    this.app.use('/', this.indexRouter);

    this.https = require("http")
    this.port = this.normalizePort(process.env.PORT || "3000")
    this.app.set("port", this.port)

    this.server = this.https.createServer(this.app)

    this.server.listen(this.port,function(){
      console.log("Listening to the port: ",process.env.PORT || "3000");
    })
    this.server.on("error", this.onError)
    this.server.on("listening", this.onListening)
  }

  /**
   * Method to normalize some port
   * @param val Value to normalize
   */
   normalizePort(val) {
    const port = parseInt(val, 10)
    if (isNaN(port))
      return val
    if (port >= 0)
      return port
    return false
  }

  /**
   * Event listener for HTTP server "error" event
   * @param error Error to handle
   */
  onError(error) {
    if (error.syscall !== "listen") throw error
    const bind = typeof this.port === "string" ? "Pipe " + this.port : "Port " + this.port
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges")
        process.exit(1)
        break
      case "EADDRINUSE":
        console.error(bind + " is already in use")
        process.exit(1)
        break
      default:
        throw error
    }
  }
  /**
   * Event listener for HTTP server "listening" event.
   */
  onListening() {
    const addr = this.address()
    const debug = require("debug")("server")
    const bind = typeof addr === "string" ?
      "pipe " + addr :
      "port " + addr.port
    debug("Listening on " + bind)
  }
}

const app = new App()

module.exports = app.app
