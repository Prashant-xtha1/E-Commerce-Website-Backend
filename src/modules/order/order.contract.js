const Joi = require("joi");

const AddToCartDTO = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
})

module.exports = {
  AddToCartDTO
}