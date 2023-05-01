import { User } from "@prisma/client"
import { prismaClientSingleton } from "../util/prisma_client"

export default class UserRepo {

    public static findUserById(idUser: number): Promise<User | null> {
        return prismaClientSingleton.user.findUnique({
            where: {
                idUser
            }
        })
    }
}