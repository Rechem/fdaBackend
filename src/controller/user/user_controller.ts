import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../handler/async_handler";
import { SuccessCreationResponse, SuccessResponse } from "../../handler/api_response";
import schema from "./schema";
import { AuthFailureError, BadRequestError } from "../../handler/api_error";
import UserRepo from "../../repository/user_repository";
import _ from "lodash";
import { createToken, userJwtPayload } from "../../util/token";
import bcrypt from 'bcrypt';

export default class UserController {

    public static login = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {

            const { error } = schema.loginSchema.validate(req.body);

            if (error) {
                throw new BadRequestError(error.details[0].message)
            }

            const user = await UserRepo.findUserByEmail(req.body.email);

            if (!user) {
                throw new BadRequestError('Invalid credentials');
            }


            const match: boolean = await bcrypt.compare(req.body.password, user.password);
            if (!match)
                throw new AuthFailureError('Incorrect password');

            const userObject = _.pick(user, ["idUser", "username", "email", "phoneNumber", "address", "avatar"]);

            const token = createToken({ idUser: userObject.idUser }, `${process.env.JWT_SECRET_KEY}`)

            return new SuccessResponse("Logged in succesfuly", { ...userObject, token }).send(res);
        }
    )

    public static signUp = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {

            const { error } = schema.signUpSchema.validate(req.body);

            if (error) {
                throw new BadRequestError(error.details[0].message)
            }

            const existingUser = await UserRepo.findUserByEmail(req.body.email);

            if (existingUser) {
                throw new BadRequestError('Email already taken')
            }

            const hashedPassword = req.body.password ? await bcrypt.hash(req.body.password, 10) : ''

            const newUserObject = {
                email: req.body.email,
                password: hashedPassword,
                username: req.body.username,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
            }

            const user = await UserRepo.addUser(newUserObject);

            const userObject = _.pick(user, ["idUser", "username", "email", "phoneNumber", "address", "avatar"]);

            const token = createToken({ idUser: userObject.idUser }, `${process.env.JWT_SECRET_KEY}`)

            return new SuccessCreationResponse("Signed up succesfuly", { ...userObject, token }).send(res);
        }
    )

    public static addAvatar = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {

            let avatar: string;
            const idUser = req.user.idUser;

            if (req.file) {
                avatar = req.file.path
            } else {
                throw new BadRequestError('Avatar not provided')
            }

            await UserRepo.updateAvatar({ idUser, avatar })

            new SuccessResponse('Avatar updated successfuly', avatar).send(res)
        }
    )

}