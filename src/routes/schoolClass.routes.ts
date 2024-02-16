import { Router } from 'express';
import { ensureSchoolAuth } from '../middlewares/ensureSchoolAuth';
import { SchoolClassController } from '../controllers/SchoolClassController';
import { ensureTeachertAuth } from '../middlewares/ensureTeacherAuth';
import { ensureStudentAuth } from '../middlewares/ensureStudentAuth';

const schoolClassRoutes = Router();

const schoolClassController = new SchoolClassController();

schoolClassRoutes.post('/', ensureSchoolAuth, schoolClassController.create); // testado
schoolClassRoutes.get('/view', ensureSchoolAuth, schoolClassController.view);
schoolClassRoutes.get('/class/:id', ensureSchoolAuth, schoolClassController.viewClassDetails); // testado
schoolClassRoutes.get('/exportTeacher', ensureTeachertAuth, schoolClassController.exportTeacher);
schoolClassRoutes.get('/exportStudent', ensureStudentAuth, schoolClassController.exportStudent);
schoolClassRoutes.get('/list', ensureSchoolAuth, schoolClassController.list); // testado

export { schoolClassRoutes };
