import jwt, { JwtPayload } from 'jsonwebtoken'

export type userJwtPayload = {
    idUser: number
}

export const createToken = (payload:object, secretKey:string) =>
    jwt.sign(payload, secretKey, {expiresIn : '365 days'});