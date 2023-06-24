import  express  from "express";
import RestaurantController from "../controller/restaurant/restaurant_controller";
import { verifyAuth } from "../middleware/verify_auth";

const restaurantRouter = express.Router();

restaurantRouter.get("/", RestaurantController.getRestaurants);
restaurantRouter.post("/rate", verifyAuth,RestaurantController.rateRestaurant);

export default restaurantRouter;