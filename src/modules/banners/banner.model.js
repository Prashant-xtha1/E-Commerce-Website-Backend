const { Status } = require("../../config/constants");
const { sequelize } = require("../../config/sequelize.config");
const { DataTypes } = require("sequelize");

const BannerModel = sequelize.define("banners_1", {
    _id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: Status.INACTIVE,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
      onUpdate: Date.now(),
    },
  },
  {
    tableName: "banners_1",
  },
);

module.exports = BannerModel;
