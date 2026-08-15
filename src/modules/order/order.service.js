const OrderModel = require("./order.model");

class OrderService {
  async getSingleRowByFilter(filter){
    try {
      const order = await OrderModel.findOne(filter)
      .populate("buyer", "_id name email role image status")
      .populate("detail.product", "_id name slug price images status discount afterDiscount")
      return order;
    } catch (exception) {
      throw exception;
    }
  } 

  createOrderDetail(productInfo, quantity) {
    return {
      product: productInfo._id,
      price: productInfo.afterDiscount,
      name: productInfo.name,
      seller: productInfo.seller._id,
      quantity: +quantity,
      subTotal: +quantity * productInfo.afterDiscount,
    }
  }

  createOrderCostCalculation(orderDetail) {
    let orderCostCalculation = {
      subTotal: 0,
      serviceCharge: 0,
      discount: 0,
      tax: 0,
      total: 0,
    };

    orderDetail.map((item) => {
      orderCostCalculation.subTotal += item.subTotal;
    })
    
    orderCostCalculation.serviceCharge = orderCostCalculation.subTotal * 0.10;
    orderCostCalculation.discount = 0;
    const netSubTotal = (orderCostCalculation.subTotal + orderCostCalculation.serviceCharge - orderCostCalculation.discount);
    orderCostCalculation.tax = netSubTotal * 0.13;
    orderCostCalculation.total = netSubTotal + orderCostCalculation.tax

    return orderCostCalculation;
  }

  async createOrder(data) {
    try {
      const order = new OrderModel(data);
      return await order.save();
    } catch (exception) {
      throw exception;
    }
  }

  async updateSingleRowByFilter(filter, data) {
    try {
      const order = await OrderModel.findOneAndUpdate(
        filter,
        {$set: data},
        {new: true},
      );
      return order;
    } catch (exception) {
      throw exception
    }
  }
}


const orderService = new OrderService();
module.exports = orderService;