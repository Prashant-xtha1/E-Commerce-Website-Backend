const { UserRoles } = require("../../config/constants");
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

  async updateOrRemoveFromCart (req, res, next) {
    try {
      const cartId = req.params.cartId;
      const loggedInUser = req.loggedInUser;
      const {product, quantity} = req.body;

      let cart = await orderService.getSingleRowByFilter({
        _id: cartId,
        buyer: loggedInUser._id,
        status: "cart"
      });

      if(!cart) {
        throw {
          code: 404,
          message: "Cart not found",
          status: "CART_NOT_FOUND_ERR",
        }
      }

      const productDetail = await productService.getSingleRowByFilter({
        _id: product
      })

      if(!productDetail) {
        throw {
          code: 404,
          message: "Product not found",
          status: "PRODUCT_NOT_FOUND_ERR",
        }
      }

      let index = null;
      cart.detail.map((item, ind) => {
        if(item.product._id.equals(product)) {
          index = ind;
        };
      });

      if(index === null) {
        throw {
          code: 404,
          message: "Product doesnot exists in cart anymore",
          status: "PRODUCT_ITEM_NOT_FOUND_ERR",
        }
      }

      let cartItems = cart.detail;
      let orderDetail = cartItems[index];

      if(orderDetail.quantity < quantity) {
        throw {
          code: 422,
          message: "Quantity is less in your cart",
          status: "LESS_QUANTITY_IN_CART_ERR",
        }
      } else if (+quantity === 0 || +quantity === orderDetail.quantity) {
        // remove quantity
        cartItems.splice(index, 1);
      } else {
        cartItems[index].quantity -= +quantity;
        cartItems[index].price = productDetail.afterDiscount;
        cartItems[index].subTotal = cartItems[index].quantity * cartItems[index].price;
      }

      let msg = "";

      if(cartItems.length > 0) {
        // update cart
        const updateBody = {
          detail: cartItems,
          ...orderService.createOrderCostCalculation(cartItems)
        }
        cart = await orderService.updateSingleRowByFilter({_id: cartId}, updateBody)
        msg = "Your cart updated successfully";
      } else {
        // delete cart
        cart = await orderService.deleteSingleRowByFilter({_id: cartId});
        msg = "Your cart deleted successfully";
      }

      res.json({
        data: cart,
        message: msg,
        status: "SUCCESS",
      })

    } catch (exception) {
      next(exception);
    }
  }

  async checkoutOrder (req, res, next) {
    try {
      const {cartId, discount} = req.body;

      let cart = await orderService.getSingleRowByFilter({
        _id: cartId, 
        buyer: req.loggedInUser._id, 
        status: "cart"
      })

      if(!cart) {
        throw {
          code: 404,
          message: "Cart doesnot exists anymore",
          status: "CART_NOT_FOUND_ERR",
        }
      }

      cart = await orderService.updateSingleRowByFilter({_id: cartId}, {status: "new"});

      res.json({
        data: cart,
        message: "Your order has been placed successfully",
        status: "SUCCESS",
      })
    } catch (exception) {
      next(exception);
    }
  }

    async getMyOrderList (req, res, next) {
    try {
      let filter = {
        status: {$ne: "cart"}
      }

      const loggedInUser = req.loggedInUser;

      if(loggedInUser.role === UserRoles.CUSTOMER) {
        filter = {
          ...filter,
          buyer: loggedInUser._id,
        }
      } else if(loggedInUser.role === UserRoles.SELLER) {
        filter = {
          ...filter,
          "product.seller": loggedInUser._id
        }
      }

      if(req.query.status) {
        filter = {
          ...filter,
          status: req.query.status
        }
      }

      const config = {
        page: +req.query.page || 1,
        limit: +req.query.limit || 20
      }

      const {data, pagination} = await orderService.getAllRowsByFilter(filter, config);
      res.json({
        data: data,
        msg: "Your Order List",
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