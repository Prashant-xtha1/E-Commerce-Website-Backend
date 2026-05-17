const express = require("express");
const router = require("../routes/router");
const app = express();

app.use("/e-commerce", router)

module.exports = app;