import Joi from 'joi'

const rating = {
    idRestaurant : Joi.number().required(),
    experience : Joi.string().required().allow(null, ""),
    rating : Joi.number().integer().min(1).max(5).required(),
}

export default {
    ratingSchema: Joi.object(rating)
 }