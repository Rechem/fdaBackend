import  express  from "express";
import OrderController from "../controller/order/order_controller";
import { verifyAuth } from "../middleware/verify_auth";

const orderRouter = express.Router();

orderRouter.get("/",verifyAuth, OrderController.getAllOrders);
orderRouter.get("/:id",verifyAuth, OrderController.getOrder);
orderRouter.post("/",verifyAuth, OrderController.addOrder);

export default orderRouter;