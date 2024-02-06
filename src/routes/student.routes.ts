import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureSchoolAuth';
import { StudentController } from '../controllers/StudentController';
import { ensureStudentAuth } from '../middlewares/ensureStudentAuth';
const studentRoutes = Router();

const studentController = new StudentController();

studentRoutes.post('/', ensureAuthenticated, studentController.create);
studentRoutes.get('/', ensureStudentAuth, studentController.view); // vou mexer aqui
studentRoutes.delete('/', ensureAuthenticated, studentController.delete);
studentRoutes.get('/list', ensureAuthenticated, studentController.list);
studentRoutes.get('/listClass', ensureAuthenticated, studentController.listClass);
studentRoutes.put('/update', ensureAuthenticated, studentController.update);
export { studentRoutes };
