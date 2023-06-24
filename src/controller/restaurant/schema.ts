import Joi from 'joi'

const rating = {
    idRestaurant : Joi.number().required(),
    experience : Joi.string().required().allow(null, ""),
    rating : Joi.number().min(0).max(5).required(),
}

export default {
    ratingSchema: Joi.object(rating)
 }