import { Request } from 'express';
import { userJwtPayload } from '../../util/token';

declare global {
    namespace Express {
      interface Request {
        user: userJwtPayload
      }
    }
  }