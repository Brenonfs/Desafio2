/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { jwtConfig } from '../configs/auth';
import { UnauthorizedError } from '../helpers/api-erros';

declare module 'express-serve-static-core' {
  interface Request {
    student?: {
      id: number;
      schoolId: number; // Adicionando schoolId ao objeto student
    };
  }
}

const ensureStudentAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [, token] = authHeader.split(' ');

  try {
    if (jwtConfig && jwtConfig.secret !== undefined) {
      console.log('jwt secret', jwtConfig.secret);
      console.log(token);
      const decodedToken = verify(token, jwtConfig.secret) as { sub: string; schoolId: number }; // Adicionando schoolId ao tipo do token decodificado
      console.log('Decoded token:', decodedToken);
      req.student = {
        id: Number(decodedToken.sub),
        schoolId: decodedToken.schoolId, // Incluindo schoolId no objeto student
      };
      console.log('schoolId in ensureStudentAuth:', req.student?.schoolId);
      return next();
    } else {
      throw new Error('JWT configuration is not properly set');
    }
  } catch {
    throw new UnauthorizedError('JWT Token invalid');
  }
};

export { ensureStudentAuth };
