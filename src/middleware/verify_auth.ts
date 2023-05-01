import { NextFunction, Request, Response } from 'express'
import asyncHandler from '../handler/async_handler';
import { BadRequestError, BadTokenError, InternalError, AuthFailureError } from '../handler/api_error';
import jwt from "jsonwebtoken";
import { userJwtPayload } from '../util/token';
import UserRepo from '../repository/user_repository';

export const verifyAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const token = req.header('Authorization').replace('Bearer ', '')

    let decoded: any;

    try {
        decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as {
            user: userJwtPayload,
        }
    } catch (err: unknown) {
        throw new BadTokenError('Please login');
    }

    const userFetched = await UserRepo.findUserById(decoded.user.idUser);

    if (!userFetched) {
        throw new InternalError('User not found')
    }

    req.user = decoded?.user;
    next();
})