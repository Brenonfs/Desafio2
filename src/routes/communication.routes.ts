import { Router } from 'express';
import { CommunicationController } from '../controllers/CommunicationController';
import { ensureSchoolAuth } from '../middlewares/ensureSchoolAuth';

const communicationRoutes = Router();

const communicationController = new CommunicationController();

communicationRoutes.post('/', ensureSchoolAuth, communicationController.create);
communicationRoutes.get('/view/:schoolId/:communicationId', communicationController.view);
communicationRoutes.get('/list/:id', communicationController.list);

export { communicationRoutes };
