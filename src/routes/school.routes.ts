import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureSchoolAuth';
import { SchoolController } from '../controllers/SchoolController';

const schoolRoutes = Router();

const schoolController = new SchoolController();

schoolRoutes.post('/', schoolController.create);
schoolRoutes.get('/view', ensureAuthenticated, schoolController.view);
schoolRoutes.delete('/', ensureAuthenticated, schoolController.delete);
schoolRoutes.get('/listAdmin', schoolController.listAdmin);
schoolRoutes.get('/list', schoolController.listPublic);

export { schoolRoutes };
