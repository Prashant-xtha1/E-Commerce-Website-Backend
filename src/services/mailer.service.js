const nodemailer = require("nodemailer");
const { SMTPConfig } = require("../config/app.config");
class EmailService {
  #transport;

  constructor() {
    try {
      this.#transport = nodemailer.createTransport({
        host: SMTPConfig.smtpHost,
        port: SMTPConfig.smtpPort,
        service: SMTPConfig.smtpProvider,
        auth: {
          user: SMTPConfig.smtpUser,
          pass: SMTPConfig.smtpPassword,
        }
      });
      console.log("SMTP Service Connected Successfully");
    } catch (exception) {
      throw{
        code: 500,
        message: "SMTP Connection Failed",
        status: "SMTP_CONNECTION_ERR",
      }
    }
  }
}