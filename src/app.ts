import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import { BadRequestError, NotFoundError, UnauthorizedError } from './helpers/api-erros';
import { router } from './routes';

dotenv.config();
const app = express();

// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log('Acesso ao roteador detectado:', req.method, req.url);
//   next();
// });
app.use(express.json());
app.use(router);

app.use((error: Error, req: Request, res: Response) => {
  if (error instanceof UnauthorizedError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }
  if (error instanceof BadRequestError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }
  if (error instanceof NotFoundError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }
  return res.status(500).json({
    status: 'error',
    message: 'internal error',
  });
});

export { app };
