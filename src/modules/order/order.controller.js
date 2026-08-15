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

      if(!productInfo) {
        throw {
          code: 404,
          message: "Product Not Found",
          status: "PRODUCT_NOT_FOUND_ERR",
        }
      }

      let cart = await orderService.getSingleRowByFilter({
        status: "cart",
        buyer: loggedInUser._id
      })
      
      let orderCostCalculation = {
        subTotal: 0,
        serviceCharge: 0,
        discount: 0,
        tax: 0,
        total: 0,
      };

      let orderDetail = null;
      let msg = "";
      let transaction = null;
      let order = null;

      // if cart exists in db then update cart 
      if(cart) {
        orderDetail = cart.detail;
      } else {
        // create cart if not exists in db
        orderDetail = [orderService.createOrderDetail(productInfo, quantity)];
        orderCostCalculation = orderService.createOrderCostCalculation(orderDetail);
        
        let orderInfo = {
          orderId: generateRandomString(15),
          buyer: loggedInUser._id,
          detail: orderDetail,
          ...orderCostCalculation,
          transaction: transaction,
          status: "cart",
          createdBy: loggedInUser._id,
        }

        order = await orderService.createOrder(orderInfo);
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