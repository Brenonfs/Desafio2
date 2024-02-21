/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { BadRequestError, UnauthorizedError } from '../helpers/api-erros';
import { ListCommunicationService } from '../services/CommunicationService/listCommunication.service';
import { CreateCommunicationService } from '../services/CommunicationService/createCommunication.service';
import { ViewCommunicationService } from '../services/CommunicationService/viewCommunication.service';
import { communcationCreateSchema } from '../schemas/communication';

export class CommunicationController {
  private createCommunicationService: CreateCommunicationService;
  private listCommunicationService: ListCommunicationService;
  private viewCommunicationService: ViewCommunicationService;

  constructor() {
    this.createCommunicationService = new CreateCommunicationService();
    this.listCommunicationService = new ListCommunicationService();
    this.viewCommunicationService = new ViewCommunicationService();
  }

  create = async (req: Request, res: Response) => {
    const schoolId = (req as any).school?.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const validatedCommuncationSchema = communcationCreateSchema.safeParse(req.body);

    if (!validatedCommuncationSchema.success) {
      throw new BadRequestError(`Não foi possível criar a classe.`);
    }
    const result = await this.createCommunicationService.execute(
      validatedCommuncationSchema.data.messageType,
      validatedCommuncationSchema.data.message,
      schoolId,
    );
    res.json({ result });
  };
  view = async (req: Request, res: Response) => {
    const schoolId = +req.params.schoolId;
    const communicationId = +req.params.communicationId;
    if (isNaN(schoolId) || isNaN(communicationId)) {
      throw new UnauthorizedError('Parâmetros inválidos.');
    }

    const result = await this.viewCommunicationService.execute(communicationId, schoolId);
    res.json({ result });
  };

  list = async (req: Request, res: Response) => {
    const schoolId = +req.params.id;
    if (schoolId === undefined) {
      throw new UnauthorizedError('Usuário não está autenticado.');
    }
    const result = await this.listCommunicationService.execute(schoolId);
    res.json({ result });
  };
}
