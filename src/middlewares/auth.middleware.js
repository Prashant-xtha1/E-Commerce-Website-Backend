// This middleware helps to checkLogin of users i.e. Seller, Customer, Admin
const checkLogin = (req, res, next) => {
  console.log("I am checkLogin");
  next();
}

module.exports = checkLogin;