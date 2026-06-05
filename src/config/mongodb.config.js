const mongoose = require("mongoose");
const { DbConfig } = require("./app.config");

(async () => {
  try {
    await mongoose.connect(DbConfig.mongodb.url, {
      dbName: DbConfig.mongodb.dbname,
      autoCreate: true,
      autoIndex: true,
    });
    console.log("***** MongoDB Connected Successfully *****");
  } catch (exception) {
    console.error(exception);
    throw {
      code: 500,
      message: "MongoDB Server Connection Failed...",
      status: "MONGODB_SERVER_CONNECTION_ERR",
    }
  }
})()