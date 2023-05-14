import jwt, { JwtPayload } from 'jsonwebtoken'

export type userJwtPayload = {
    idUser: number
    // username: string,
    // email: string,
    // avatar: string,
    // phoneNumber: string
}

export const createToken = (payload:userJwtPayload, secretKey:string) =>
    jwt.sign(payload, secretKey, {expiresIn : '365 days'});