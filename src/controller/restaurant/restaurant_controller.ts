import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../handler/async_handler";
import { SuccessMsgResponse, SuccessResponse } from "../../handler/api_response";
import RestaurantRepository from "../../repository/restaurant_repository";
import schema from "./schema";
import { BadRequestError, NotFoundError } from "../../handler/api_error";

export default class RestaurantController {

    public static getRestaurants = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {

            const restaurants = await RestaurantRepository.findRestaurants();

            return new SuccessResponse("Restaurants", restaurants).send(res)
        }
    )
    
    public static rateRestaurant = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {

            const { error } = schema.ratingSchema.validate(req.body);

            if (error) {
                throw new BadRequestError(error.details[0].message)
            }

            const idRestaurant = Number(req.body.idRestaurant)

            const restaurant = await RestaurantRepository.findRestaurantById(idRestaurant);

            if(!restaurant){
                throw new NotFoundError("Restaurant not found")
            }

            const data = {
                idRestaurant,
                idUser : req.body.idUser,
                experience : req.body.experience,
                rating : req.body.rating
            }

            const rated = await RestaurantRepository.rateRestaurant(data);

            return new SuccessMsgResponse("Restaurant rated successfuly").send(res)
        }
    )
}