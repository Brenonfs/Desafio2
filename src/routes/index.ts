import { Router } from 'express';
import { sessionRoutes } from './session.routes';
import { schoolRoutes } from './school.routes';
import { teacherRoutes } from './teacher.routes';
import { studentRoutes } from './student.routes';
import { schoolClassRoutes } from './schoolClass.routes';
import { communicationRoutes } from './communication.routes';

const router = Router();

router.use('/school', schoolRoutes);
router.use('/session', sessionRoutes);
router.use('/teacher', teacherRoutes);
router.use('/student', studentRoutes);
router.use('/schoolClass', schoolClassRoutes);
router.use('/communication', communicationRoutes);

export { router };
