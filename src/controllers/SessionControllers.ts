import { Request, Response } from 'express';
import { BadRequestError } from '../helpers/api-erros';
import { sessionSchoolSchema, sessionStudentSchema, sessionTeacherSchema } from '../schemas/session';
import { SchoolSessionService } from '../services/SessionService/schoolSession.service';
import { StudentSessionService } from '../services/SessionService/studentSession.service';
import { TeacherSessionService } from '../services/SessionService/teacherSession.service';

export class SessionController {
  private schoolSessionService: SchoolSessionService;
  private studentSessionService: StudentSessionService;
  private teacherSessionService: TeacherSessionService;

  constructor() {
    this.schoolSessionService = new SchoolSessionService();
    this.studentSessionService = new StudentSessionService();
    this.teacherSessionService = new TeacherSessionService();
  }

  sessionSchool = async (req: Request, res: Response) => {
    const validatedSessionSchema = sessionSchoolSchema.safeParse(req.body);
    if (!validatedSessionSchema.success) {
      throw new BadRequestError(`Não foi possível fazer o login.`);
    }

    const result = await this.schoolSessionService.execute(
      validatedSessionSchema.data.schoolCode,
      validatedSessionSchema.data.password,
    );

    res.json({ result });
  };
  sessionTeacher = async (req: Request, res: Response) => {
    const validatedSessionSchema = sessionTeacherSchema.safeParse(req.body);
    if (!validatedSessionSchema.success) {
      throw new BadRequestError(`Não foi possível fazer o login.`);
    }

    const result = await this.teacherSessionService.execute(
      validatedSessionSchema.data.teacherCode,
      validatedSessionSchema.data.password,
    );

    res.json({ result });
  };
  sessionStudent = async (req: Request, res: Response) => {
    const validatedSessionSchema = sessionStudentSchema.safeParse(req.body);
    if (!validatedSessionSchema.success) {
      throw new BadRequestError(`Não foi possível fazer o login.`);
    }

    const result = await this.studentSessionService.execute(
      validatedSessionSchema.data.registration,
      validatedSessionSchema.data.password,
    );

    res.json({ result });
  };
}
