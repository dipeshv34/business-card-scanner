/**
 * Setting Configuration Class
 */
 class Config {
    constructor(port, commonConfig, messages) {
      this.port = port;
      this.commonConfig = commonConfig;
      this.messages = messages;
    }
  }

  /**
 * Creating Configuration Attributes
 */
const port = process.env.PORT;
const commonConfig = {
  APP_NAME: "Mobile APP",
  APP_DESCRIPTION: "Mobile APP",
  SECRET_KEY: process.env.SECRET_KEY,
};
const messages = {
  INVALID_CREDENTIALS: "Invalid Login Credentials",
  USER_CREATED : "User __value__"
};

/**
 * Setting object to return
 */
 const config = new Config(port, commonConfig, messages);

 /**
  * Exporting Module
  */
 module.exports = config;
 