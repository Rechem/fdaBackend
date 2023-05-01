import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../handler/async_handler";
import OrderRepo from "../../repository/order_repository";
import { SuccessCreationResponse, SuccessResponse } from "../../handler/api_response";
import schema from "./schema";
import { BadRequestError } from "../../handler/api_error";
import MealRepo from "../../repository/meal_repository";

export default class OrderController {

    public static getAllOrders = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const userId = req.user.idUser;

            const usersOrders = await OrderRepo.findOrdersByUserId(userId);

            return new SuccessResponse("Orders", usersOrders).send(res)
        }
    )

    public static addOrder = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const userId = req.user.idUser;

            const { error } = schema.orderSchema.validate(req.body);

            if (error) {
                throw new BadRequestError(error.details[0].message)
            }

            const meals = req.body.meals

            for(const mealItem of meals){

                const meal = await MealRepo.findMealById(mealItem.idMeal);

                if(!meal){
                    throw new BadRequestError(`Meal ${mealItem.idMeal} not found`)
                }
            }

            // what about the deliverer ?
            const newOrder = await OrderRepo.findOrdersByUserId(userId);

            return new SuccessCreationResponse("Order", newOrder).send(res)
        }
    )

}