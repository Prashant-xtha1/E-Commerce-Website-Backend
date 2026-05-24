const express = require("express");
const router = require("../routes/router");
const app = express();

// Setting urlencoded parser
app.use(
  express.urlencoded({
    limit: "5mb",
  }),
);

// Setting json parser
app.use(
  express.json({
    limit: "5mb",
  }),
);

app.use("/e-commerce", router);

// Creating 404 router catch 
app.use((req, res, next) => {
  next({
    code: 404,
    message: "Not Found",
    status: "NOT_FOUND",
  })
})

// Error Handling Middleware
app.use((error, req, res, next) => {
  console.log(error);
  let code = error.code ?? 500;
  let details = error.details ?? error.detail ?? null;
  let msg = error.message ?? "App Server Error....";
  let status = error.status ?? "APP_ERR";

  res.status(code).json({
    error: details,
    message: msg,
    status: status,
  })
})


module.exports = app;
