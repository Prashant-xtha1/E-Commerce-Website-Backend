const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({

})

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;