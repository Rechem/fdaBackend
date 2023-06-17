import  express  from "express";
import MealController from "../controller/meal/meal_controller";
import { verifyAuth } from "../middleware/verify_auth";

const mealRouter = express.Router();

mealRouter.get("/restaurant/:idRestaurant", MealController.getMeals);
mealRouter.get("/:idMeal", MealController.getMeal);

export default mealRouter;