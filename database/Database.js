/**
 * DataBase Configuration Class
 */

 const { ErrorHandler } = require('../helpers/error')

 class DataBase {
    /**
     * Constructor
     */
    constructor() {
      this.config = require("../config/Config");
      this.mongoose = require("mongoose");
      this.seed = require("../seed/Seed");
      this.connect();
    }
  
    /**
     * Connect to DataBase
     */
    connect() {
      this.mongoose
        .connect(process.env.MONGO_CNNSTR, {
          // useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          // user: process.env.MONGO_USER,
          // pass: process.env.MONGO_PASS,
          // auth: { authSource: "admin" }
        })
        .then(() => {
          if (process.env.IS_SEED == "true" || process.env.IS_SEED == true) {
            console.log("----SEED TRUE----");
            this.seed.connect();
          } else {
            console.log("----SEED NOT RUN----");
          }
          console.log(process.env.CLEAR_SEED);
          if(process.env.CLEAR_SEED == "true" || process.env.CLEAR_SEED == true){
            console.log('----CLEAR SEED TRUE----');
            this.seed.clearSeed()
          } else {
            console.log('----CLEAR SEED NOT RUN----');
          }
        })
        .catch((err) => {
          console.log("----err--in----", err);
          ErrorHandler(err,"Database Connection Error")
        });
    }
  }
  
  module.exports = new DataBase();
  