const { Sequelize } = require("sequelize");
const { DbConfig } = require("./app.config");

const sequelize = new Sequelize(DbConfig.pg.url, {
  dialect: DbConfig.pg.dialect,
  dialectOptions: {
    ssl: {
      require: true
    }
  }
}) 

const sqlInit = async() => {
  try {
    await sequelize.authenticate();
    console.log("*** SQL server connected successfully ***");
  } catch (exception) {
    console.log("*** Error found connecting sql server ***");
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  sqlInit
}