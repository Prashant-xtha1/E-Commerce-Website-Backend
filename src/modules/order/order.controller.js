const { generateRandomString } = require("../../utilities/helper");

class OrderController {
  async addToCart (req, res, next) {
    try {
      const {product, quantity} = req.body;
      const loggedInUser = req.loggedInUser;

      // orderDetail according to the model
      let orderDetail = [{
        product: "",
        price: "",
        name: "",
        seller: "",
        quantity: "",
        subTotal: "",
      }];

      let orderCalculation = {
        subTotal: "",
        serviceCharge: "",
        discount: "",
        tax: "",
        total: "",
      };

      let transaction = null;

      let order = {
        orderId: generateRandomString(15),
        buyer: loggedInUser._id,
        detail: orderDetail,
        ...orderCalculation,
        transaction: transaction,
        status: "cart",
        createdBy: loggedInUser._id,
      }

    } catch (exception) {
      next(exception);
    }
  }
}

const orderCtrl = new OrderController();
module.exports = orderCtrl;