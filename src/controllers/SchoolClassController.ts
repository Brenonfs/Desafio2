/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { CreateSchoolClassService } from '../services/SchoolClassService/createSchoolClass.service';
import { DeleteSchoolClassService } from '../services/SchoolClassService/deleteSchoolClass.service';
import { ListSchoolClassService } from '../services/SchoolClassService/listSchoolClass.service';
import { ViewSchoolClassService } from '../services/SchoolClassService/viewSchoolClass.service';
import {
  schoolClassCreateSchema,
  schoolClassDeleteSchema,
  schoolClassUpdateSchema,
  schoolClassViewSchema,
} from '../schemas/schoolClass';
import { UpdateSchoolClassService } from '../services/SchoolClassService/updateSchoolClassservice';

export class SchoolClassController {
  private createSchoolClassService: CreateSchoolClassService;
  private deleteSchoolClassService: DeleteSchoolClassService;
  private updateSchoolClassService: UpdateSchoolClassService;
  private listSchoolClassService: ListSchoolClassService;
  private viewSchoolClassService: ViewSchoolClassService;

  constructor() {
    this.createSchoolClassService = new CreateSchoolClassService();
    this.deleteSchoolClassService = new DeleteSchoolClassService();
    this.updateSchoolClassService = new UpdateSchoolClassService();
    this.listSchoolClassService = new ListSchoolClassService();
    this.viewSchoolClassService = new ViewSchoolClassService();
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
  delete = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedSchoolClassSchema = schoolClassDeleteSchema.safeParse(req.body);
    if (!validatedSchoolClassSchema.success) {
      throw new BadRequestError(`Não foi possível deleta a classe.`);
    }
    const result = await this.deleteSchoolClassService.execute(
      validatedSchoolClassSchema.data.schoolClassCode,
      schoolId,
    );
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
  update = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedSchoolClassSchema = schoolClassUpdateSchema.safeParse(req.body);
    if (!validatedSchoolClassSchema.success) {
      throw new BadRequestError(`Não foi possível matricular na classe.`);
    }
    const result = await this.updateSchoolClassService.execute(
      validatedSchoolClassSchema.data.registration,
      validatedSchoolClassSchema.data.schoolClassCode,
      schoolId,
    );
    res.json({ result });
  };
  // precisa de uma class de update
}
