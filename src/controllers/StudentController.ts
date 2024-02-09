/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { CreateStudentService } from '../services/StudentService/createStudent.service';
import { ListStudentService } from '../services/StudentService/listStudent.service';
import { ViewStudentByStudentSerivce } from '../services/StudentService/viewStudentByStudent.service';
import { ViewStudentBySchoolService } from '../services/StudentService/viewStudentBySchool.service';
import {
  listclassStudentSchema,
  studentCreateSchema,
  studentUpdateSchema,
  studentViewSchema,
} from '../schemas/student';
import { ListStudentClassService } from '../services/StudentService/listStudentClass.service';
import { UpdateStudentService } from '../services/StudentService/updateStudent.service';
import { ViewStudentSchoolService } from '../services/StudentService/viewStudentSchool.service';
// import { ExportClassOfStudentService } from '../services/StudentService/exportClassOfStudent.service copy';
import { ImportFileService } from '../services/FileService/importFile.service';

export class StudentController {
  private createStudentService: CreateStudentService;
  private listStudentService: ListStudentService;
  private listStudentClassService: ListStudentClassService;
  private viewStudentByStudentSerivce: ViewStudentByStudentSerivce;
  private viewStudentBySchoolService: ViewStudentBySchoolService;
  private viewStudentSchoolService: ViewStudentSchoolService;
  private updateStudentService: UpdateStudentService;
  // private exportClassOfStudentService: ExportClassOfStudentService;
  private importFileService: ImportFileService;

  constructor() {
    this.createStudentService = new CreateStudentService();
    this.listStudentService = new ListStudentService();
    this.listStudentClassService = new ListStudentClassService();
    this.viewStudentByStudentSerivce = new ViewStudentByStudentSerivce();
    this.viewStudentBySchoolService = new ViewStudentBySchoolService();
    this.viewStudentSchoolService = new ViewStudentSchoolService();
    this.updateStudentService = new UpdateStudentService();
    // this.exportClassOfStudentService = new ExportClassOfStudentService();
    this.importFileService = new ImportFileService();
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

    console.log(' aqui 2', schoolId);
    console.log(' aqui 1', studentId);
    if (schoolId === undefined && studentId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
      console.log(' aqui');
    }
    const validatedStudentSchema = studentViewSchema.safeParse(req.body);
    if (!validatedStudentSchema.success) {
      throw new BadRequestError(`Não foi possível visualizar Aluno(a).`);
      console.log(' aqui');
    }
    const result = await this.viewStudentSchoolService.execute(
      validatedStudentSchema.data.registration,
      studentId,
      schoolId,
    );
    res.json({ result });
  };

  // exportClassOfService = async (req: Request, res: Response) => {
  //   const studentId = req.student?.id;
  //   const schoolId = req.school?.id;
  //   if (schoolId === undefined && studentId === undefined) {
  //     throw new UnauthorizedError('Usuário não está autenticado.');
  //   }
  //   const validatedStudentSchema = studentViewSchema.safeParse(req.body);
  //   if (!validatedStudentSchema.success) {
  //     throw new BadRequestError(`Não foi possível visualizar Aluno(a).`);
  //   }
  //   const key = await this.exportClassOfStudentService.execute(req.body.registration, studentId, schoolId);
  //   if (key === undefined) {
  //     throw new BadRequestError('Falha com conexão com AWS S3.');
  //   }

  //   const excelUrl = await this.importFileService.execute(key);
  //   if (excelUrl === undefined) {
  //     throw new BadRequestError('A URL do avatar não foi obtida corretamente.');
  //   }
  //   res.json({ excelUrl });
  // };

  listStudent = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const result = await this.listStudentService.execute(schoolId);
    res.json({ result });
  };

  listStudentInClass = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedStudentSchema = listclassStudentSchema.safeParse(req.body);
    if (!validatedStudentSchema.success) {
      throw new BadRequestError(`Não foi possível visualizar Alunos(as).`);
    }
    const result = await this.listStudentClassService.execute(validatedStudentSchema.data.schoolClassCode, schoolId);
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
