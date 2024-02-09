import { Router } from 'express';
import { ensureSchoolAuth } from '../middlewares/ensureSchoolAuth';
import { TeacherController } from '../controllers/TeacherController';
import { ensureTeachertAuth } from '../middlewares/ensureTeacherAuth';

const teacherRoutes = Router();

const teacherController = new TeacherController();

teacherRoutes.post('/', ensureSchoolAuth, teacherController.create);
teacherRoutes.get('/viewSchool', ensureSchoolAuth, teacherController.viewTeachertBySchool);
teacherRoutes.get('/viewTeacher', ensureTeachertAuth, teacherController.viewTeachertByTeacher);
teacherRoutes.get('/view', ensureSchoolAuth, ensureTeachertAuth, teacherController.viewTeacherAndSchool);
teacherRoutes.get('/list', ensureSchoolAuth, teacherController.list);
teacherRoutes.put('/', ensureSchoolAuth, teacherController.update);
export { teacherRoutes };
