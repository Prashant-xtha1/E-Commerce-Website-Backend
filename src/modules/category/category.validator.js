const Joi = require("joi");
const { Status } = require("../../config/constants");
//  Creating CategoryDTO

const CategoryDTO = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  parentId: Joi.string().optional().allow(null, "").default(null),
  brandId: Joi.array().items(Joi.string()).optional().allow(null, "").default(null),
  status: Joi.string().regex(/^(active|inactive)$/).default(Status.INACTIVE),
  image: Joi.string().allow(null, "").optional().default(null),
})

module.exports = {
  CategoryDTO,
}