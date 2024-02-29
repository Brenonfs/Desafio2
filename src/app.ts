import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import { router } from './routes';
import { errorMiddleware } from './middlewares/error';

dotenv.config();
const app = express();

// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log('Acesso ao roteador detectado:', req.method, req.url);
//   next();
// });
app.use(express.json());
app.use(router);
app.use(errorMiddleware);

export { app };
