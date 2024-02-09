// ensureSchoolAuth.ts
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { jwtConfig } from '../configs/auth';
import { UnauthorizedError } from '../helpers/api-erros';

declare module 'express-serve-static-core' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Request {
    school?: {
      id: number;
    };
  }
}
const ensureSchoolAuth = async (req: Request, res: Response, next: NextFunction) => {
  console.log('hello');
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [, token] = authHeader.split(' ');

  try {
    if (jwtConfig && jwtConfig.secret !== undefined) {
      const decodedToken = verify(token, jwtConfig.secret) as { sub: string };
      req.school = {
        id: Number(decodedToken.sub),
      };
      return next();
    } else {
      throw new Error('JWT configuration is not properly set');
    }
  } catch {
    throw new UnauthorizedError('JWT Token invalid');
  }
};

export { ensureSchoolAuth };
