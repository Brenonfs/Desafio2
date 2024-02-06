/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { CreateStudentService } from '../services/StudentService/createStudent.service';
import { DeleteStudentService } from '../services/StudentService/deleteStudent.service';
import { ListStudentService } from '../services/StudentService/listStudent.service';
import { ViewStudentService } from '../services/StudentService/viewStudent.service';
import {
  listclassStudentSchema,
  studentCreateSchema,
  studentDeleteSchema,
  studentUpdateSchema,
  studentViewSchema,
} from '../schemas/student';
import { ListStudentClassService } from '../services/StudentService/listStudentClass.service';
import { UpdateStudentService } from '../services/StudentService/updateStudentservice';

export class StudentController {
  private createStudentService: CreateStudentService;
  private deleteStudentService: DeleteStudentService;
  private listStudentService: ListStudentService;
  private listStudentClassService: ListStudentClassService;
  private viewStudentService: ViewStudentService;
  private updateStudentService: UpdateStudentService;

  constructor() {
    this.createStudentService = new CreateStudentService();
    this.deleteStudentService = new DeleteStudentService();
    this.listStudentService = new ListStudentService();
    this.listStudentClassService = new ListStudentClassService();
    this.viewStudentService = new ViewStudentService();
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
  view = async (req: Request, res: Response) => {
    const schoolId = req.student?.schoolId; // Ajustando para acessar schoolId diretamente de req.student
    console.log(schoolId);
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedStudentSchema = studentViewSchema.safeParse(req.body);
    if (!validatedStudentSchema.success) {
      throw new BadRequestError(`Não foi possível visualizar Aluno(a).`);
    }
    const result = await this.viewStudentService.execute(validatedStudentSchema.data.profileName, schoolId);
    res.json({ result });
  };
  delete = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedStudentSchema = studentDeleteSchema.safeParse(req.body);
    if (!validatedStudentSchema.success) {
      throw new BadRequestError(`Não foi possível deleta Aluno(a).`);
    }
    const result = await this.deleteStudentService.execute(validatedStudentSchema.data.registration, schoolId);
    res.json({ result });
  };
  list = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const result = await this.listStudentService.execute(schoolId);
    res.json({ result });
  };
  listClass = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedStudentSchema = listclassStudentSchema.safeParse(req.body);
    if (!validatedStudentSchema.success) {
      throw new BadRequestError(`Não foi possível deleta Aluno(a).`);
    }
    const result = await this.listStudentClassService.execute(validatedStudentSchema.data.registration, schoolId);
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
    const result = await this.updateStudentService.execute(
      validatedStudentSchema.data.registration,
      validatedStudentSchema.data.schoolClassCode,
      schoolId,
    );
    res.json({ result });
  };
}
