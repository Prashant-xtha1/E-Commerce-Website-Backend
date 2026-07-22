const Joi = require("joi");
const { Status } = require("../../config/constants");
//  Creating CategoryDTO

const CategoryDTO = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  status: Joi.string().regex(/^(active|inactive)$/).default(Status.INACTIVE),
  logo: Joi.string().allow(null, "").optional().default(null),
})

module.exports = {
  CategoryDTO,
}