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

  async sendEmail({to, subject, message, cc=null, bcc=null, attachments=null}) {
    try {
      let messageBody = {
        to: to,
        from: SMTPConfig.smtpFrom,
        subject: subject,
        html: message,
      };
      if(cc) {
        messageBody["cc"] = cc;
      }
      if(bcc) {
        messageBody["bcc"] = bcc;
      }
      if(attachments) {
        messageBody["attachments"] = attachments;
      }
      return await this.#transport.sendMail(messageBody);
    } catch (exception) {
      throw {
        code: 500,
        message: "Email Cannot Be Sent",
        status: "SMTP_MAIL_SENT_ERR",
      }
    }
  }
}

const emailService = new EmailService();
module.exports = emailService;