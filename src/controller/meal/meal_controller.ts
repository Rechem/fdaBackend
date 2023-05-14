import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../handler/async_handler";
import { SuccessResponse } from "../../handler/api_response";
import MealRepo from "../../repository/meal_repository";

export default class MealController {

    public static getMeals = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const restaurantId = parseInt(req.params.idRestaurant);

            const meals = await MealRepo.findMealsByRestaurantId(restaurantId);

            return new SuccessResponse("Meals", meals).send(res)
        }
    )

    public static getMeal = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const mealId = parseInt(req.params.idMeal);

            const meal = await MealRepo.findMealById(mealId);

            return new SuccessResponse("Meal", meal).send(res)
        }
    )
}