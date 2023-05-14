import  express  from "express";
import RestaurantController from "../controller/restaurant/restaurant_controller";

const restaurantRouter = express.Router();

restaurantRouter.get("/", RestaurantController.getRestaurants);
restaurantRouter.post("/rate", RestaurantController.rateRestaurant);

export default restaurantRouter;