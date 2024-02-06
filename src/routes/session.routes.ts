import { Router } from 'express';

import { SessionController } from '../controllers/SessionControllers';

const sessionRoutes = Router();

const sessionController = new SessionController();

sessionRoutes.post('/school', sessionController.sessionSchool);
sessionRoutes.post('/teacher', sessionController.sessionTeacher);
sessionRoutes.post('/student', sessionController.sessionStudent);

export { sessionRoutes };
