import { Order } from "@prisma/client"
import { prismaClientSingleton } from "../util/prisma_client"

export default class OrderRepo {

    public static findOrdersByUserId(idUser: number): Promise<Order[] | null> {
        return prismaClientSingleton.order.findMany({
            where: {
                idUser
            }
        })
    }

    public static addOrder(idUser: number, cookNote: string, deliveryNote: string, deliveryAddress: string,
        meals: Array<{
            idMeal: number;
            quantity: number;
        }>): Promise<Order | null> {
        return prismaClientSingleton.order.create({
            data: {
                idUser,
                cookNote,
                deliveryNote,
                deliveryAddress,
                meals: {
                    create: meals.map(m => ({
                        meal: {
                            connect: { idMeal: m.idMeal },
                        },
                        quantity: m.quantity
                    }))
                }
            }
        })
    }
}