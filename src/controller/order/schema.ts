import Joi from 'joi'

const order = {
    cookNote : Joi.string().required().allow(null, ""),
    deliveryAddress : Joi.string().required(),
    deliveryNote : Joi.string().required().allow(null, ""),
    meals : Joi.array().items(Joi.object({
        idMeal : Joi.number().positive().required(),
        quantity : Joi.number().positive().required()
    })).required()
}

export default {
    orderSchema: Joi.object(order)
 }