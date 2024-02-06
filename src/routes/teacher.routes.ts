import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureSchoolAuth';
import { TeacherController } from '../controllers/TeacherController';

const teacherRoutes = Router();

const teacherController = new TeacherController();

teacherRoutes.post('/', ensureAuthenticated, teacherController.create);
teacherRoutes.get('/view', ensureAuthenticated, teacherController.view);
teacherRoutes.delete('/', ensureAuthenticated, teacherController.delete);
teacherRoutes.get('/list', ensureAuthenticated, teacherController.list);
export { teacherRoutes };
