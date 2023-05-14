import { Rating, Restaurant } from "@prisma/client"
import { prismaClientSingleton } from "../util/prisma_client"
import { filesPrefix } from "../.."

interface IRateRestaurant {
    idRestaurant: number,
    idUser: number,
    rating: number,
    experience: string | null
}

type RestaurantRated = {
    idRestaurant: number,
    name: string,
    address: string,
    location: string,
    phoneNumber: string,
    email: string,
    facebook: string,
    instagram: string,
    picture: string,
    restaurantType: string,
    rating: number,
    reviews: number,
}

export default class RestaurantRepo {

    public static rateRestaurant({ idRestaurant, idUser, rating, experience }: IRateRestaurant): Promise<Rating | null> {
        return prismaClientSingleton.rating.create({
            data: {
                idRestaurant, idUser, rating, experience
            }
        })
    }

    public static async findRestaurants(): Promise<RestaurantRated[] | null> {
        const restaurants = await prismaClientSingleton.restaurant.findMany({
            include: {
                restaurantType: true,
            }
        })

        const ratings = await prismaClientSingleton.rating.groupBy({
            by: ["idRestaurant"],
            _avg: {
                rating: true
            },
            _count : true
        })

        return restaurants.map((e, index) => {
            const data = {
                ...e,
                picture : filesPrefix + e.picture,
                restaurantType: e.restaurantType.type,
                rating: ratings[index]?._avg.rating ?? 0,
                reviews: ratings[index]?._count ?? 0
            }

            delete data.idRestaurantType

            return data
        })
    }

    public static findRestaurantById(idRestaurant: number): Promise<Restaurant | null> {
        return prismaClientSingleton.restaurant.findUnique({
            where: {
                idRestaurant
            }
        })
    }
}