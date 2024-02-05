import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { StudentController } from '../controllers/StudentController';

const studentRoutes = Router();

const studentController = new StudentController();

studentRoutes.post('/', ensureAuthenticated, studentController.create);
studentRoutes.get('/', ensureAuthenticated, studentController.view);
studentRoutes.delete('/', ensureAuthenticated, studentController.delete);
studentRoutes.get('/list', ensureAuthenticated, studentController.list);
studentRoutes.get('/listClass', ensureAuthenticated, studentController.listClass);

export { studentRoutes };
