import { Meal } from "@prisma/client"
import { prismaClientSingleton } from "../util/prisma_client"
import { filesPrefix } from "../.."

export default class MealRepo {

    public static findMealById(idMeal: number): Promise<Meal | null> {
        return prismaClientSingleton.meal.findUnique({
            where : {
                idMeal
            }
        })
    }

    public static async findMealsByRestaurantId(idRestaurant: number): Promise<Meal[] | null> {
        const meals = await prismaClientSingleton.meal.findMany({
            where : {
                idRestaurant
            }
        })

        return meals.map((e, index)=>({...e, picture : filesPrefix + e.picture}))
    }
}