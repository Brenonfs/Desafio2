import { Router } from 'express';
import { ensureSchoolAuth } from '../middlewares/ensureSchoolAuth';
import { SchoolController } from '../controllers/SchoolController';
import { ensureAdminAuth } from '../middlewares/ensureAdminAuth';

const schoolRoutes = Router();

const schoolController = new SchoolController();

schoolRoutes.post('/', schoolController.create);
schoolRoutes.get('/viewPublic', schoolController.viewPublic);
schoolRoutes.get('/view', ensureSchoolAuth, schoolController.view);
schoolRoutes.get('/listAdmin', ensureAdminAuth, schoolController.listAdmin);
schoolRoutes.get('/list', schoolController.listPublic);

export { schoolRoutes };
