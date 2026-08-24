const Joi = require("joi");

const AddToCartDTO = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
})

const UpdateCartDTO = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().min(0).required(),
})

module.exports = {
  AddToCartDTO,
  UpdateCartDTO,
}