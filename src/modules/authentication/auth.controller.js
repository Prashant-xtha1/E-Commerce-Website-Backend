class AuthController {
  registerUser = (req, res) => {
    const body = req.body;
    const image = req.file;
    const data = {
      body,
      image
    }
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

  getLoggedInUser = (req, res, next) => {
    res.json({
      message: "I am logged in user"
    })
    // next();
  }
}

const authCtrl = new AuthController();
module.exports = authCtrl;