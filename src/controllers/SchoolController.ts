/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { CreateSchoolService } from '../services/SchoolService/createSchool.service';
import { schoolCreateSchema, schoolDeleteSchema, schoolViewSchema } from '../schemas/school';
import { ViewSchoolService } from '../services/SchoolService/viewSchool.service';
import { ListPublicSchoolService } from '../services/SchoolService/listPublicSchool.service';
import { DeleteSchoolService } from '../services/SchoolService/deleteSchool.service';
import { ListAdminSchoolService } from '../services/SchoolService/listAdminSchool.service';

export class SchoolController {
  private createSchoolService: CreateSchoolService;
  private deleteSchoolService: DeleteSchoolService;
  private listAdminSchoolService: ListAdminSchoolService;
  private listPublicSchoolService: ListPublicSchoolService;
  private viewSchoolService: ViewSchoolService;

  constructor() {
    this.createSchoolService = new CreateSchoolService();
    this.deleteSchoolService = new DeleteSchoolService();
    this.listAdminSchoolService = new ListAdminSchoolService();
    this.listPublicSchoolService = new ListPublicSchoolService();
    this.viewSchoolService = new ViewSchoolService();
  }

  create = async (req: Request, res: Response) => {
    const validatedSchoolSchema = schoolCreateSchema.safeParse(req.body);
    if (!validatedSchoolSchema.success) {
      throw new BadRequestError(`Não foi possível criar escola.`);
    }
    const result = await this.createSchoolService.execute(
      validatedSchoolSchema.data.schoolCode,
      validatedSchoolSchema.data.password,
      validatedSchoolSchema.data.cep,
      validatedSchoolSchema.data.profileName,
    );
    res.json({ result });
  };

  view = async (req: Request, res: Response) => {
    const validatedSchoolSchema = schoolViewSchema.safeParse(req.body);
    if (!validatedSchoolSchema.success) {
      throw new BadRequestError(`Não foi possível visualizar escola.`);
    }
    const result = await this.viewSchoolService.execute(validatedSchoolSchema.data.profileName);
    res.json({ result });
  };

  delete = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedSchoolSchema = schoolDeleteSchema.safeParse(req.body);
    if (!validatedSchoolSchema.success) {
      throw new BadRequestError(`Não foi possível visualizar escola.`);
    }
    const result = await this.deleteSchoolService.execute(validatedSchoolSchema.data.schoolCode);
    res.json({ result });
  };
  listAdmin = async (req: Request, res: Response) => {
    // precisa de login do tipo admin
    const result = await this.listAdminSchoolService.execute();
    res.json({ result });
  };
  listPublic = async (req: Request, res: Response) => {
    const result = await this.listPublicSchoolService.execute();
    res.json({ result });
  };
}