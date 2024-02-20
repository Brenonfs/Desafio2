/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { CreateTeacherService } from '../services/TeacherService/createTeacher.service';
import { ListTeacherService } from '../services/TeacherService/listTeacher.service';
import { ViewTeacherByTeacherService } from '../services/TeacherService/viewTeacherByTeacher.service';
import { teacherCreateSchema, teacherUpdateSchema, teacherViewSchema } from '../schemas/teacher';
import { ViewTeacherBySchoolService } from '../services/TeacherService/viewTeacherBySchool.service';

import { UpdateTeacherService } from '../services/TeacherService/updateTeacherservice';

export class TeacherController {
  private createTeacherService: CreateTeacherService;
  private listTeacherService: ListTeacherService;
  private viewTeacherBySchoolService: ViewTeacherBySchoolService;
  private viewTeacherByTeacherService: ViewTeacherByTeacherService;
  private updateTeacherService: UpdateTeacherService;

  constructor() {
    this.createTeacherService = new CreateTeacherService();
    this.listTeacherService = new ListTeacherService();
    this.viewTeacherBySchoolService = new ViewTeacherBySchoolService();
    this.viewTeacherByTeacherService = new ViewTeacherByTeacherService();
    this.updateTeacherService = new UpdateTeacherService();
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
  viewTeachertBySchool = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedTeacherSchema = teacherViewSchema.safeParse(req.body);
    if (!validatedTeacherSchema.success) {
      throw new BadRequestError(`Não foi possível visualizar Professor(a).`);
    }
    const result = await this.viewTeacherBySchoolService.execute(validatedTeacherSchema.data.teacherCode, schoolId);
    res.json({ result });
  };
  viewTeachertByTeacher = async (req: Request, res: Response) => {
    const teacherId = (req as any).teacher.id;
    if (teacherId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const result = await this.viewTeacherByTeacherService.execute(teacherId);
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
  update = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedStudentSchema = teacherUpdateSchema.safeParse(req.body);
    if (!validatedStudentSchema.success) {
      throw new BadRequestError(`Não foi possível atualizar profesor(a).`);
    }
    const classId = +req.params.id;
    if (!classId) {
      throw new BadRequestError(`ID não informado.`);
    }
    const result = await this.updateTeacherService.execute(validatedStudentSchema.data.teacherCode, classId, schoolId);
    res.json({ result });
  };
}
