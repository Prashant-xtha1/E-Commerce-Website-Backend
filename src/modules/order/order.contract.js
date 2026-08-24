const Joi = require("joi");

const AddToCartDTO = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
})

const UpdateCartDTO = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().min(0).required(),
})

const CheckoutDTO = Joi.object({
  cartId: Joi.string().required(),
  discount: Joi.number().min(0).max(95).optional(),
})

module.exports = {
  AddToCartDTO,
  UpdateCartDTO,
  CheckoutDTO,
}