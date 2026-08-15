const { generateRandomString } = require("../../utilities/helper");
const productService = require("../product/product.service");
const orderService = require("./order.service");

class OrderController {
  async addToCart (req, res, next) {
    try {
      const {product, quantity} = req.body;
      const loggedInUser = req.loggedInUser;

      const productInfo = await productService.getSingleRowByFilter({
        _id: product
      })

      

      // orderDetail according to the model
      let orderDetail = [orderService.createOrderDetail(productInfo, quantity)];
      console.log(orderDetail);

      let orderCalculation = {
        subTotal: 0,
        serviceCharge: 0,
        discount: 0,
        tax: 0,
        total: 0,
      };

      let transaction = null;

      let orderInfo = {
        orderId: generateRandomString(15),
        buyer: loggedInUser._id,
        detail: orderDetail,
        ...orderCalculation,
        transaction: transaction,
        status: "cart",
        createdBy: loggedInUser._id,
      }

      res.json({
        data: orderInfo,
        msg: "Success"
      })

    } catch (exception) {
      next(exception);
    }
  }
}

const orderCtrl = new OrderController();
module.exports = orderCtrl;