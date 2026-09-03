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

const AppConfig = {
  environment: process.env.ENVIRONMENT,
  feUrl: process.env.FRONTEND_URL,
  beUrl: process.env.BACKEND_URL,
  jwtSecret: process.env.JWT_SECRET,
}

const KhaltiConfig = {
  key: process.env.KHALTI_API_KEY,
  url: process.env.KHALTI_PAYMENT_URL,
}

module.exports = {
  CloudinaryConfig,
  DbConfig,
  SMTPConfig,
  AppConfig,
  KhaltiConfig,
}