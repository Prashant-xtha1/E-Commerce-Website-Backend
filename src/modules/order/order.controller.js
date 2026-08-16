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

      let orderDetail = null;

       let orderCostCalculation = {
        subTotal: 0,
        serviceCharge: 0,
        discount: 0,
        tax: 0,
        total: 0,
      };

      let msg = "";
      let transaction = null;
      let order = null;

      if(cart) {
        // if cart exists -> update cart
        orderDetail = cart.detail;

        let index = null;
        orderDetail.map((orderDet, ind) => {
          if(orderDet.product._id.equals(product)){
            index = ind;
          }
        })

        if(index === null) {
          orderDetail.push(orderService.createOrderDetail(productInfo, quantity));
        } else {
          orderDetail[index].quantity = +orderDetail[index].quantity + +quantity;
          orderDetail[index].price = productInfo.afterDiscount;
          orderDetail[index].subTotal = productInfo.price * orderDetail[index].quantity
        }

        orderCostCalculation = orderService.createOrderCostCalculation(orderDetail);

        const updateData = {
          detail: orderDetail,
          ...orderCostCalculation,
          updatedBy: loggedInUser._id,
        }

        msg = "Cart Updated Successfully"; 
        order = await orderService.updateSingleRowByFilter({_id: cart._id}, updateData);
       
      } else {
        // if cart doesnot exists -> create cart

        // orderDetail = [
        //   {
        //     product: productInfo._id,
        //     price: productInfo.afterDiscount,
        //     name: productInfo.name,
        //     seller: productInfo.seller._id,
        //     quantity: +quantity,
        //     subTotal: +quantity * productInfo.afterDiscount,
        //   }
        // ];

        orderDetail = [orderService.createOrderDetail(productInfo, quantity)]

        // Cost Calculation

        // orderCostCalculation.subTotal = +quantity * productInfo.afterDiscount;
        // orderCostCalculation.serviceCharge = orderCostCalculation.subTotal * 0.10;
        // orderCostCalculation.discount = 0;
        // const netSubTotal = (orderCostCalculation.subTotal + orderCostCalculation.serviceCharge - orderCostCalculation.discount);
        // orderCostCalculation.tax = netSubTotal * 0.13;
        // orderCostCalculation.total = netSubTotal + orderCostCalculation.tax;

        orderCostCalculation = orderService.createOrderCostCalculation(orderDetail);
        msg = "Cart Created Successfully";

        // Creating Order Information
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
        data: order,
        msg: msg,
        status: "SUCCESS"
      });

    } catch (exception) {
      next(exception);
    }
  }

  async getMyCartList (req, res, next) {
    try {
      let filter = {
        status: "cart",
        buyer: req.loggedInUser
      }

      const config = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 20
      }

      const {data, pagination} = await orderService.getAllRowsByFilter(filter, config);
      res.json({
        data: data,
        msg: "Your Cart List",
        status: "SUCCESS",
        meta: {
          pagination
        }
      })

    } catch (exception) {
      next(exception);
    }
  }
}

const orderCtrl = new OrderController();
module.exports = orderCtrl;