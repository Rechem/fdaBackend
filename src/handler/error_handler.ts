import { NextFunction , Request , Response} from 'express';
import { ApiError, ErrorType, InternalError } from './api_error';

export const errorHandler = (err : Error, req:Request, res:Response , next : NextFunction ) => {
    if (err instanceof ApiError) {
      ApiError.handle(<ApiError>err, res);
        if (err.type === ErrorType.INTERNAL)
          console.log(
            `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
          );
      } else {
        console.log(
          `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
        );
        if (process.env.NODE_ENV === 'development') {
          return res.status(500).send(err);
        }
        ApiError.handle(new InternalError(), res);
      }
  
  }