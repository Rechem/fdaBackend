import Joi from 'joi'

const login = {
    email : Joi.string().email().required(),
    password : Joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)).required(),
}

const signUp = {
    username : Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string().pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)).required(),
    phoneNumber : Joi.string().pattern(new RegExp(/^\+*[0-9]+/)).required().allow(null, ""),
    address : Joi.string().required().allow(null, ""),
}

export default {
    loginSchema: Joi.object(login),
    signUpSchema: Joi.object(signUp),
 }