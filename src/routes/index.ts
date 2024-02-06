import { Router } from 'express';
import { sessionRoutes } from './session.routes';
import { schoolRoutes } from './school.routes';
import { teacherRoutes } from './teacher.routes';
import { studentRoutes } from './student.routes';
import { schoolClassRoutes } from './schoolClass.routes';

const router = Router();

router.use('/school', schoolRoutes); // Montando as rotas da escola primeiro
router.use('/session', sessionRoutes);
router.use('/teacher', teacherRoutes);
router.use('/student', studentRoutes);
router.use('/schoolClass', schoolClassRoutes);

export { router };
