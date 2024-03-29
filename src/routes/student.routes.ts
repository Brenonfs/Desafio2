import { Router } from 'express';
import { ensureSchoolAuth } from '../middlewares/ensureSchoolAuth';
import { StudentController } from '../controllers/StudentController';
import { ensureStudentAuth } from '../middlewares/ensureStudentAuth';
const studentRoutes = Router();

const studentController = new StudentController();

studentRoutes.post('/', ensureSchoolAuth, studentController.create);
studentRoutes.get('/viewStudent', ensureStudentAuth, studentController.viewStudentByStudent);
studentRoutes.get('/viewSchool', ensureSchoolAuth, studentController.viewStudentBySchool);
studentRoutes.get('/list', ensureSchoolAuth, studentController.listStudent);
studentRoutes.put('/class/:id', ensureSchoolAuth, studentController.update);
export { studentRoutes };
