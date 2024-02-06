/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { CreateTeacherService } from '../services/TeacherService/createTeacher.service';
import { DeleteTeacherService } from '../services/TeacherService/deleteTeacher.service';
import { ListTeacherService } from '../services/TeacherService/listTeacher.service';
import { ViewTeacherService } from '../services/TeacherService/viewTeacher.service';
import { teacherCreateSchema, teacherDeleteSchema, teacherViewSchema } from '../schemas/teacher';

export class TeacherController {
  private createTeacherService: CreateTeacherService;
  private deleteTeacherService: DeleteTeacherService;
  private listTeacherService: ListTeacherService;
  private viewTeacherService: ViewTeacherService;

  constructor() {
    this.createTeacherService = new CreateTeacherService();
    this.deleteTeacherService = new DeleteTeacherService();
    this.listTeacherService = new ListTeacherService();
    this.viewTeacherService = new ViewTeacherService();
  }

  create = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedTeacherSchema = teacherCreateSchema.safeParse(req.body);
    if (!validatedTeacherSchema.success) {
      throw new BadRequestError(`Não foi possível criar Professor(a).`);
    }
    const result = await this.createTeacherService.execute(
      validatedTeacherSchema.data.teacherCode,
      validatedTeacherSchema.data.password,
      validatedTeacherSchema.data.discipline,
      validatedTeacherSchema.data.profileName,
      schoolId,
    );
    res.json({ result });
  };
  view = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedTeacherSchema = teacherViewSchema.safeParse(req.body);
    if (!validatedTeacherSchema.success) {
      throw new BadRequestError(`Não foi possível visualizar Professor(a).`);
    }
    const result = await this.viewTeacherService.execute(validatedTeacherSchema.data.profileName, schoolId);
    res.json({ result });
  };
  delete = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedTeacherSchema = teacherDeleteSchema.safeParse(req.body);
    if (!validatedTeacherSchema.success) {
      throw new BadRequestError(`Não foi possível deleta Professor(a).`);
    }
    const result = await this.deleteTeacherService.execute(validatedTeacherSchema.data.teacherCode, schoolId);
    res.json({ result });
  };
  list = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const result = await this.listTeacherService.execute(schoolId);
    res.json({ result });
  };
}
