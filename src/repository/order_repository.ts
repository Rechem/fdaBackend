import { Order } from "@prisma/client"
import { prismaClientSingleton } from "../util/prisma_client"

interface IAddOrder {
    idUser: number,
    cookNote: string,
    deliveryNote: string,
    deliveryAddress: string,
    meals: Array<{
        idMeal: number;
        quantity: number;
    }>
}

export default class OrderRepo {

    public static findOrdersByUserId(idUser: number): Promise<any[] | null> {

        return prismaClientSingleton.$queryRaw`
        select o.idOrder, r.\`name\` as restaurantName, o.status,
        DATE_FORMAT(o.date, \'%d/%m/%Y\') as date, total.totalPrice
        from \`order\` o 
        join (select distinct idOrder, idMeal from orderMeal) om
        on o.idOrder = om.idOrder
        join meal m on m.idMeal = om.idMeal
        join restaurant r on r.idRestaurant = m.idRestaurant
        join (select idOrder, sum(quantity * m.price) as totalPrice from orderMeal om
        join meal m on m.idMeal = om.idMeal
        group by idOrder) total on total.idOrder = o.idOrder
        where o.idUser = ${idUser}`;
    }

    public static async findOrderOwnerId(idOrder: number): Promise<number> {

        const user = await prismaClientSingleton.order.findUnique({
            where: {
                idOrder
            },
            select: {
                idUser: true
            }
        })

        return user.idUser;
    }

    public static async findOrderById(idOrder: number): Promise<any> {

        const totalPrice = await prismaClientSingleton.$queryRaw`
        select sum(quantity * m.price) as totalPrice from orderMeal om
        join meal m on m.idMeal = om.idMeal
        where idOrder = ${idOrder}`;

        const restaurantName = await prismaClientSingleton.$queryRaw`
        select r.\`name\` as restaurantName from \`order\` o 
        join (select distinct idOrder, idMeal from orderMeal) om
        on o.idOrder = om.idOrder
        join meal m on m.idMeal = om.idMeal
        join restaurant r on r.idRestaurant = m.idRestaurant
        where o.idOrder = ${idOrder};`;

        const date = await prismaClientSingleton.$queryRaw`
        SELECT DATE_FORMAT(date, \'%d/%m/%Y\') as date from \`order\` where idOrder=${idOrder}`

        const order:any = await prismaClientSingleton.order.findUnique({
            where: {
                idOrder
            },
            include: {
                meals: {
                    select: {
                        meal: {
                            select: {
                                name: true,
                                price: true,
                            },
                        },
                        quantity: true,
                    }
                },
                deliverer:{
                    select:{
                        lastName: true,
                        firstName: true,
                        phoneNumber: true,
                    }
                },

            }
        })

        delete order.deliveryAddress
        delete order.cookNote
        delete order.deliveryNote
        delete order.idUser
        delete order.idDeliverer

        order.restaurantName = restaurantName[0].restaurantName
        order.totalPrice = Number(totalPrice[0].totalPrice)
        order.date = date[0].date
        order.meals = order.meals.map((meal)=>{
            return {name : meal.meal.name, price: meal.meal.price, quantity: meal.quantity}
        })

        return order
    }

    public static addOrder({
        idUser,
        cookNote,
        deliveryNote,
        deliveryAddress,
        meals }: IAddOrder): Promise<Order | null> {

        const max = 2, min = 1;

        const idDeliverer = Math.floor(Math.random() * (max - min + 1)) + min;

        return prismaClientSingleton.order.create({
            data: {
                idUser,
                cookNote,
                deliveryNote,
                deliveryAddress,
                idDeliverer,
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