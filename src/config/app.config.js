require("dotenv").config();

const CloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
}

const DbConfig = {
  mongodb: {
    url: process.env.MONGODB_URL,
    dbname: process.env.MONGODB_DBNAME,
  }
}

const SMTPConfig = {
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  smtpFrom: process.env.SMTP_FROM,
  smtpProvider: process.env.SMTP_PROVIDER,
}

module.exports = {
  CloudinaryConfig,
  DbConfig,
  SMTPConfig
}