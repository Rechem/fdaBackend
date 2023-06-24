import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../handler/async_handler";
import OrderRepo from "../../repository/order_repository";
import { SuccessCreationResponse, SuccessResponse } from "../../handler/api_response";
import schema from "./schema";
import { BadRequestError, NotFoundError } from "../../handler/api_error";
import MealRepo from "../../repository/meal_repository";
import { OrderStatus } from "@prisma/client";
import { firebaseAdmin } from "../../util/firebase_client";
import { Message } from "firebase-admin/lib/messaging/messaging-api";

export default class OrderController {

    public static getOrder = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const userId = req.user.idUser;

            const orderId = Number(req.params.id)

            if(orderId <= 0){
                throw new BadRequestError("Order id is invalid")
            }

            const orderOwnerId = await OrderRepo.findOrderOwnerId(orderId);

            if(orderOwnerId != req.user.idUser){
                throw new NotFoundError()
            }

            const order = await OrderRepo.findOrderById(orderId);

            return new SuccessResponse("Orders", order).send(res)
        }
    )

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
                console.log(error);
                
                throw new BadRequestError(error.details[0].message)
            }

            const meals = req.body.meals

            for(const mealItem of meals){

                const meal = await MealRepo.findMealById(mealItem.idMeal);

                if(!meal){
                    throw new BadRequestError(`Meal ${mealItem.idMeal} not found`)
                }
            }

            let newOrder = await OrderRepo.addOrder({idUser : userId, cookNote : req.body.cookNote,
                deliveryAddress: req.body.deliveryAddress, deliveryNote: req.body.deliveryNote, meals})

            console.log(newOrder);
            
            new SuccessCreationResponse("Order", newOrder).send(res)

            const randomTime1 = 10000
            const randomTime2 = 10000
            const randomTime3 = 10000


            setTimeout(async () => {
                await OrderRepo.updateOrderStatus(newOrder.idOrder, OrderStatus.Preparing);

                _sendNotificationToTopic(
                    req.body.fcmToken,
                    'Your order is being prepared',
                    `Your order #${newOrder.idOrder} is now being prepared !`)
                    console.log(`Your order #${newOrder.idOrder} is now being prepared !`);
                    

                setTimeout(async() => {
                    await OrderRepo.updateOrderStatus(newOrder.idOrder, OrderStatus.Delivering);

                    _sendNotificationToTopic(
                        req.body.fcmToken,
                        'Your order is being delivered',
                        `Your order #${newOrder.idOrder} is now being delivered !`)

                        console.log(`Your order #${newOrder.idOrder} is now being delivered !`);
                        

                    setTimeout(async () => {
                        await OrderRepo.updateOrderStatus(newOrder.idOrder, OrderStatus.Delivered);

                        _sendNotificationToTopic(
                            req.body.fcmToken,
                            'Your order has been delivered',
                            `Your order #${newOrder.idOrder} has been delivered !`)
                            console.log(`Your order #${newOrder.idOrder} has been delivered !`);
                            

                    }, randomTime3)
                }, randomTime2)
            }, randomTime1);

        }
    )

}

const _sendNotificationToTopic = async (token: String, title: String, body: String) => {
    const message = {
      token,
      notification: {
        title,
        body
      }
    };
  
    try {
      await firebaseAdmin.messaging().send(message as Message);
      console.log(`Successfully sent notification to user`);
    } catch (error) {
      console.error(`Error sending notification to user`);
    }
  };