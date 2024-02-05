import { Router } from 'express';
import { schoolRoutes } from './school.routes';
import { teacherRoutes } from './teacher.routes';
import { studentRoutes } from './student.routes';
import { schoolClassRoutes } from './schoolClass.routes';

const router = Router();

export { router };
router.use('/school', schoolRoutes);
router.use('/teacher', teacherRoutes);
router.use('/student', studentRoutes);
router.use('/schoolClass', schoolClassRoutes);
