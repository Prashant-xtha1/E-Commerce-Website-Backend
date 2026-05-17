class AuthController {
  loginUser = (req, res) => {
  res.json({
    data: {},
    message: "Login Success by Prashant",
    status: "OK",
  })
}
}

const authCtrl = new AuthController();
module.exports = authCtrl;