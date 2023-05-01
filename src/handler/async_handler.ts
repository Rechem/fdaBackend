import { NextFunction, Request, Response } from 'express';

type AsyncFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export default function asyncHandler(execution: AsyncFunction) {
    return (req: Request, res: Response, next: NextFunction) => {
        execution(req, res, next).catch(next);
    }
};