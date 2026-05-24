class AuthController {
  registerUser = (req, res) => {
    const data = req.body;
    console.log(data)
    res.json({
      data: data,
      message: "Registration Success",
      status: "Ok",
    })
  }

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