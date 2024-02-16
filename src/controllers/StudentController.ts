/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { CreateStudentService } from '../services/StudentService/createStudent.service';
import { ListStudentService } from '../services/StudentService/listStudent.service';
import { ViewStudentByStudentSerivce } from '../services/StudentService/viewStudentByStudent.service';
import { ViewStudentBySchoolService } from '../services/StudentService/viewStudentBySchool.service';
import { studentCreateSchema, studentUpdateSchema, studentViewSchema } from '../schemas/student';
import { UpdateStudentService } from '../services/StudentService/updateStudent.service';
import { ViewStudentSchoolService } from '../services/StudentService/viewStudentSchool.service';

export class StudentController {
  private createStudentService: CreateStudentService;
  private listStudentService: ListStudentService;
  private viewStudentByStudentSerivce: ViewStudentByStudentSerivce;
  private viewStudentBySchoolService: ViewStudentBySchoolService;
  private viewStudentSchoolService: ViewStudentSchoolService;
  private updateStudentService: UpdateStudentService;

  constructor() {
    this.createStudentService = new CreateStudentService();
    this.listStudentService = new ListStudentService();
    this.viewStudentByStudentSerivce = new ViewStudentByStudentSerivce();
    this.viewStudentBySchoolService = new ViewStudentBySchoolService();
    this.viewStudentSchoolService = new ViewStudentSchoolService();
    this.updateStudentService = new UpdateStudentService();
  }

  create = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedStudentSchema = studentCreateSchema.safeParse(req.body);
    if (!validatedStudentSchema.success) {
      throw new BadRequestError(`Não foi possível criar Aluno(a).`);
    }
    const result = await this.createStudentService.execute(
      validatedStudentSchema.data.registration,
      validatedStudentSchema.data.password,
      validatedStudentSchema.data.profileName,
      schoolId,
    );
    res.json({ result });
  };
  viewStudentByStudent = async (req: Request, res: Response) => {
    const studentId = req.student?.id;
    if (studentId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const result = await this.viewStudentByStudentSerivce.execute(studentId);
    res.json({ result });
  };
  viewStudentBySchool = async (req: Request, res: Response) => {
    const schoolId = req.school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedStudentSchema = studentViewSchema.safeParse(req.body);
    if (!validatedStudentSchema.success) {
      throw new BadRequestError(`Não foi possível visualizar Aluno(a).`);
    }
    const result = await this.viewStudentBySchoolService.execute(schoolId, validatedStudentSchema.data.registration);
    res.json({ result });
  };
  viewStudentAndSchool = async (req: Request, res: Response) => {
    const schoolId = req.school?.id;
    const studentId = req.student?.id;

    if (schoolId === undefined && studentId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedStudentSchema = studentViewSchema.safeParse(req.body);
    if (!validatedStudentSchema.success) {
      throw new BadRequestError(`Não foi possível visualizar Aluno(a).`);
    }
    const result = await this.viewStudentSchoolService.execute(
      validatedStudentSchema.data.registration,
      studentId,
      schoolId,
    );
    res.json({ result });
  };
  listStudent = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const result = await this.listStudentService.execute(schoolId);
    res.json({ result });
  };
  update = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }

    const validatedStudentSchema = studentUpdateSchema.safeParse(req.body);
    if (!validatedStudentSchema.success) {
      throw new BadRequestError(`Não foi possível matricular na classe.`);
    }

    const classId = +req.params.id;
    if (!classId) {
      throw new BadRequestError(`ID não informado.`);
    }
    const result = await this.updateStudentService.execute(validatedStudentSchema.data.registration, classId, schoolId);
    res.json({ result });
  };
}
