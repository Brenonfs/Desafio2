/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { CreateSchoolClassService } from '../services/SchoolClassService/createSchoolClass.service';
import { ListSchoolClassService } from '../services/SchoolClassService/listSchoolClass.service';
import { ViewSchoolClassService } from '../services/SchoolClassService/viewSchoolClass.service';
import { schoolClassCreateSchema, schoolClassViewSchema } from '../schemas/schoolClass';
import { ExportSchoolClassOfTeacherService } from '../services/SchoolClassService/exportSchoolClassOfTeacher.service';
import { ExportSchoolClassOfStudentService } from '../services/SchoolClassService/exportSchoolClassOfStudent.service';
import { ImportFileService } from '../services/FileService/importFile.service';

export class SchoolClassController {
  private createSchoolClassService: CreateSchoolClassService;
  private listSchoolClassService: ListSchoolClassService;
  private viewSchoolClassService: ViewSchoolClassService;
  private exportSchoolClassOfStudentService: ExportSchoolClassOfStudentService;
  private exportSchoolClassOfTeacherService: ExportSchoolClassOfTeacherService;
  private importFileService: ImportFileService;

  constructor() {
    this.createSchoolClassService = new CreateSchoolClassService();
    this.listSchoolClassService = new ListSchoolClassService();
    this.viewSchoolClassService = new ViewSchoolClassService();
    this.exportSchoolClassOfStudentService = new ExportSchoolClassOfStudentService();
    this.exportSchoolClassOfTeacherService = new ExportSchoolClassOfTeacherService();
    this.importFileService = new ImportFileService();
  }

  create = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }

    const validatedSchoolClassSchema = schoolClassCreateSchema.safeParse(req.body);

    if (!validatedSchoolClassSchema.success) {
      throw new BadRequestError(`Não foi possível criar a classe.`);
    }
    const result = await this.createSchoolClassService.execute(
      validatedSchoolClassSchema.data.discipline,
      validatedSchoolClassSchema.data.year,
      validatedSchoolClassSchema.data.numberClass,
      validatedSchoolClassSchema.data.dayOfWeek,
      validatedSchoolClassSchema.data.time,
      schoolId,
      validatedSchoolClassSchema.data.teacherId,
    );
    res.json({ result });
  };
  view = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedSchoolClassSchema = schoolClassViewSchema.safeParse(req.body);
    if (!validatedSchoolClassSchema.success) {
      throw new BadRequestError(`Não foi possível visualizar a classe.`);
    }
    const result = await this.viewSchoolClassService.execute(validatedSchoolClassSchema.data.schoolClassCode, schoolId);
    res.json({ result });
  };

  list = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const result = await this.listSchoolClassService.execute(schoolId);
    res.json({ result });
  };
  exportTeacher = async (req: Request, res: Response) => {
    const teacherId = (req as any).teacher?.id;
    if (teacherId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const key = await this.exportSchoolClassOfTeacherService.execute(teacherId);
    if (key === undefined) {
      throw new BadRequestError('Falha com conexão com AWS S3.');
    }

    const excelUrl = await this.importFileService.execute(key);
    if (excelUrl === undefined) {
      throw new BadRequestError('A URL do avatar não foi obtida corretamente.');
    }
    res.json({ excelUrl });
  };
  exportStudent = async (req: Request, res: Response) => {
    const studentId = (req as any).student?.id;
    if (studentId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const key = await this.exportSchoolClassOfStudentService.execute(studentId);
    if (key === undefined) {
      throw new BadRequestError('Falha com conexão com AWS S3.');
    }

    const excelUrl = await this.importFileService.execute(key);
    if (excelUrl === undefined) {
      throw new BadRequestError('A URL do avatar não foi obtida corretamente.');
    }
    res.json({ excelUrl });
  };
}
