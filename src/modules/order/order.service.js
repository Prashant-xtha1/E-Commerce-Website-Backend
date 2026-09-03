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

  async getAllRowsByFilter(filter, config) {
    try {
      const skip = (config.page - 1) * config.limit;
      const data = await OrderModel.find(filter)
      .populate("buyer", "_id name email role image status")
      .populate("detail.product", "_id name slug price images status discount afterDiscount")
      .sort({"createdAt": "desc"})
      .skip(skip)
      .limit(config.limit)

      const total = await OrderModel.countDocuments(filter)

      return {
        data,
        pagination: {
          page: +config.page,
          limit: +config.limit,
          total: total,
          noOfPages: Math.ceil(total/config.limit)
        }
      }

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
        {returnDocument: "after"},
      );
      return order;
    } catch (exception) {
      throw exception
    }
  }

  async deleteSingleRowByFilter(filter){
    try {
      const order = await OrderModel.findOneAndDelete(filter);
      return order;
    } catch (exception) {
      throw exception;
    }
  }
}


const orderService = new OrderService();
module.exports = orderService;