import { User } from "@prisma/client"
import { prismaClientSingleton } from "../util/prisma_client"

interface IAddUser {
    email: string,
    password: string,
    username: string,
    address: string,
    phoneNumber: string
}

interface IUpdateAvatar {
    idUser: number,
    avatar: string
}

export default class UserRepo {

    public static findUserById(idUser: number): Promise<User | null> {
        return prismaClientSingleton.user.findUnique({
            where: {
                idUser
            }
        })
    }

    public static findUserByEmail(email: string): Promise<User | null> {
        return prismaClientSingleton.user.findUnique({
            where: {
                email
            }
        })
    }

    public static addUser({
        email,
        password,
        username,
        address,
        phoneNumber
    }: IAddUser
    ): Promise<User | null> {

        return prismaClientSingleton.user.create({
            data: {
                email,
                password,
                username,
                address,
                phoneNumber
            }
        })
    }

    public static updateAvatar({ idUser, avatar }: IUpdateAvatar): Promise<User | null> {

        return prismaClientSingleton.user.update({
            where: {
                idUser
            },
            data: {
                avatar
            }
        })
    }
}