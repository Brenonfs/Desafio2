import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { SchoolClassController } from '../controllers/SchoolClassController';

const schoolClassRoutes = Router();

const schoolClassController = new SchoolClassController();

schoolClassRoutes.post('/', ensureAuthenticated, schoolClassController.create);
schoolClassRoutes.get('/view', ensureAuthenticated, schoolClassController.view);
schoolClassRoutes.get('/list', ensureAuthenticated, schoolClassController.list);
schoolClassRoutes.delete('/', ensureAuthenticated, schoolClassController.delete);
schoolClassRoutes.put('/update', ensureAuthenticated, schoolClassController.update);

export { schoolClassRoutes };
