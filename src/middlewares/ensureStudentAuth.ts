/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { jwtConfig } from '../configs/auth';
import { UnauthorizedError } from '../helpers/api-erros';

declare module 'express-serve-static-core' {
  interface Request {
    student?: {
      id: number;
    };
  }
}

const ensureStudentAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.school) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const [, token] = authHeader.split(' ');

    try {
      if (jwtConfig && jwtConfig.secret !== undefined) {
        const decodedToken = verify(token, jwtConfig.secret) as { sub: string };
        req.student = {
          id: Number(decodedToken.sub),
        };
        return next('route');
      } else {
        throw new Error('JWT configuration is not properly set');
      }
    } catch {
      throw new UnauthorizedError('JWT Token invalid');
    }
  } else {
    return next();
  }
};

export { ensureStudentAuth };
