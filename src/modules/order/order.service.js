class OrderService {
  async getSingleRowByFilter(){
    try {
      
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
}


const orderService = new OrderService();
module.exports = orderService;