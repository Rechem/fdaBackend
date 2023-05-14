import { Meal } from "@prisma/client"
import { prismaClientSingleton } from "../util/prisma_client"

export default class MealRepo {

    public static findMealById(idMeal: number): Promise<Meal | null> {
        return prismaClientSingleton.meal.findUnique({
            where : {
                idMeal
            }
        })
    }

    public static findMealsByRestaurantId(idRestaurant: number): Promise<Meal[] | null> {
        return prismaClientSingleton.meal.findMany({
            where : {
                idRestaurant
            }
        })
    }
}